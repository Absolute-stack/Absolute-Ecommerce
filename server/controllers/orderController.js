import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { checkAndDeactivate } from "./productController.js";

export async function createOrder(req, res) {
  try {
    const { items, shippingAddress, guestEmail, guestName } = req.body;

    if (!items || !shippingAddress)
      return res.status(400).json({
        success: false,
        message: "Both items and shipping address are required",
      });

    const isGuest = !req.user;
    if (isGuest && (!guestEmail || !guestName))
      return res.status(400).json({
        success: false,
        message: "Email and password are required for guestCheckout",
      });

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    });

    if (products.length < items.length)
      return res.status(400).json({
        success: false,
        message: "One or more products are unavailable",
      });

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (product.stock < item.quantity)
        return res.status(400).json({
          success: false,
          message: `${product.name} has insufficient stock only ${product.stock} left`,
        });
    }

    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        size: item.size,
        quantity: item.quantity,
      };
    });

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const customer = {
      userId: isGuest ? null : req.user.id,
      name: isGuest ? guestName : req.user.name,
      email: isGuest ? guestEmail : req.user.email,
    };

    const order = await Order.create({
      customer,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentStatus: "pending",
      deliveryStatus: "processing",
    });
    return res.status(201).json({
      order,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function updateDeliveryStatus(req, res) {
  try {
    const { deliveryStatus } = req.body;

    const order = await Order.findById(req.params.id).lean();
    if (!order)
      return res.status(400).json({
        success: false,
        message: "No order found",
      });

    await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Order updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function deleteOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });

    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: `${order._id} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getAllOrders(req, res) {
  try {
    const { limit = 10, cursor } = req.query;
    const limitNum = Math.min(Number(limit), 50);
    const filter = {};
    if (cursor) filter._id = { $lt: cursor };

    const orders = await Order.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limitNum + 1)
      .populate("customer.userId", "name email")
      .populate("items.product", "name item")
      .lean();

    const hasNextPage = orders.length > limitNum;
    if (hasNextPage) orders.pop();

    const nextCursor = hasNextPage ? orders[orders.length - 1]._id : null;

    return res.status(200).json({
      orders,
      nextCursor,
      hasNextPage,
      success: true,
      message: "Fetched orders successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getMyOrders(req, res) {
  try {
    const { limit = 10, cursor } = req.query;

    const limitNum = Math.min(Number(limit), 50);

    const filter = { "customer.userId": req.user.id };

    if (cursor) filter._id = { $lt: cursor };

    const orders = await Order.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limitNum + 1)
      .populate("items.product", "name image")
      .lean();

    const hasNextPage = orders.length > limitNum;
    if (hasNextPage) orders.pop();

    const nextCursor = hasNextPage ? orders[orders.length - 1]._id : null;
    return res.status(200).json({
      orders,
      hasNextPage,
      nextCursor,
      success: true,
      message: "Orders retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function guestOrderLookup(req, res) {
  try {
    const { email, reference } = req.query;
    if (!email || !reference)
      return res.status(400).json({
        success: false,
        message: "Email and reference needed for guestLookup",
      });

    const order = await Order.findOne({
      "customer.email": email,
      "customer.userId": null,
      paystackReference: reference,
    }).populate("items.product", "name image");

    if (!order)
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });

    return res.status(200).json({
      order,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function markOrderAsPaid(reference) {
  const order = await Order.findOne({ paystackReference: reference });
  if (!order) throw new Error("Order not found");
  await Order.findOneAndUpdate(
    { reference },
    { paymentStatus: "paid" },
    { new: true },
  );

  await Promise.all(
    order.items.map((item) =>
      Promise.all([
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        }),
        checkAndDeactivate(item.product),
      ]),
    ),
  );
}
