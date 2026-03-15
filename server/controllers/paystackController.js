import axios from "axios";
import crypto from "crypto";
import { Order } from "../models/orderModel.js";
import { markOrderAsPaid } from "./orderController.js";

export async function initializePayment(req, res) {
  try {
    const { orderId } = req.body;
    if (!orderId)
      return res.status(400).json({
        success: false,
        message: "OrderId needed for payment initialization",
      });

    const order = await Order.findById(orderId).lean();
    if (!order)
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });

    if (order.paymentStatus === "paid")
      return res.status(400).json({
        success: false,
        message: "Order already paid",
      });
    const reference = `Order_${orderId}_${Date.now()}`;

    const response = await axios.post(
      `${process.env.PAYSTACK_BASE}/transaction/initialize`,
      {
        email: order.customer.email,
        amount: order.totalAmount * 100,
        reference,
        callback_url: `${process.env.CLIENT_URL}/order-confirmation?reference=${reference}`,
        metadata: {
          userId: order.customer.userId,
          name: order.customer.name,
          email: order.customer.email,
          items: order.items,
          shippingAddress: {
            city: order.shippingAddress.city,
            phone: order.shippingAddress.phone,
            address: order.shippingAddress.address,
          },
          totalAmount: order.totalAmount,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      },
    );

    await Order.findByIdAndUpdate(orderId, { paystackReference: reference });
    return res.status(200).json({
      success: true,
      reference,
      authorizationURL: response.data.data.authorization_url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function payStackWebhook(req, res) {
  try {
    const signature = req.headers["x-paystack-signature"];
    const expectedSignature = crypto
      .createHmac("sha512", `${process.env.PAYSTACK_SECRET}`)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature)
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });

    const event = JSON.parse(req.body.toString());
    if (event.event === "charge.success") {
      const { reference } = event.data;

      const verify = await axios.get(
        `${process.env.PAYSTACK_BASE}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        },
      );

      const transaction = verify.data.data;

      if (transaction.status === "success") {
        await markOrderAsPaid(reference);
      }
    }
    return res.status(200).json({
      success: true,
      received: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function verifyPayment(req, res) {
  try {
    const { reference } = req.query;

    const order = await Order.findOne({ paystackReference: reference });
    if (!order)
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });

    return res.status(200).json({
      success: true,
      paid: order.paymentStatus === "paid",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
