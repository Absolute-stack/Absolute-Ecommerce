import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      trim: true,
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
    },
    price: {
      min: 0,
      type: Number,
      required: true,
    },
    images: [{ type: String, required: true }],
    sizes: [{ type: String, required: true }],
    stock: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

productSchema.index({ isActive: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdAt: -1, _id: -1 });
productSchema.index({ name: 1, description: 1 });

export const Product = mongoose.model("Product", productSchema);
