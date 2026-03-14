import express from "express";
import {
  initializePayment,
  payStackWebhook,
  verifyPayment,
} from "../controllers/paystackController.js";

export const paystackRouter = express.Router();

paystackRouter.post("/initialize", initializePayment);
paystackRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  payStackWebhook,
);
paystackRouter.get("/verify", verifyPayment);
