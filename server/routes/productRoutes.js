import express from "express";

import { adminProtect } from "../middleware/protect.js";
import {
  getProducts,
  createProduct,
  getAllAdminProducts,
  getProductFilters,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

export const productRouter = express.Router();

productRouter.get("/all", getProducts);
productRouter.get("/product-filters", getProductFilters);
productRouter.post("/create", adminProtect, createProduct);
productRouter.get("/admin/all", adminProtect, getAllAdminProducts);
productRouter.get("/:id", getProductById);
productRouter.patch("/update/:id", adminProtect, updateProduct);
productRouter.delete("/:id", adminProtect, deleteProduct);
