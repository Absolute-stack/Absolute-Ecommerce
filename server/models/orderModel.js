import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  price: Number,
  image: String,
  size: String,
  quantity: {
    min: 1,
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    items: [orderItemSchema],
    shippingAddress: {
      city: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    totalAmount: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded"],
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "refunded"],
      default: "processing",
    },
    paystackReference: {
      type: String,
      sparse: true,
      unique: true,
    },
  },
  { timestamps: true },
);

orderSchema.index({ "customer.email": 1, createdAt: -1 });
orderSchema.index({ "customer.userId": 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, deliveryStatus: 1 });

export const Order = mongoose.model("Order", orderSchema);
