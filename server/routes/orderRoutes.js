import express from "express";
import { protect, adminProtect, optionalAuth } from "../middleware/protect.js";
import {
  getMyOrders,
  deleteOrder,
  createOrder,
  getAllOrders,
  guestOrderLookup,
  updateDeliveryStatus,
} from "../controllers/orderController.js";

export const orderRouter = express.Router();

orderRouter.get("/orders", protect, getMyOrders);
orderRouter.get("/admin/all", adminProtect, getAllOrders);
orderRouter.post("/create/order", optionalAuth, createOrder);
orderRouter.get("/guest-orderLookup", optionalAuth, guestOrderLookup);
orderRouter.patch("/update", adminProtect, updateDeliveryStatus);
orderRouter.delete("/delete/:id", adminProtect, deleteOrder);
