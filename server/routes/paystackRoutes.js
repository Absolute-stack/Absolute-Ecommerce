import express from "express";
import {
  initializePayment,
  verifyPayment,
} from "../controllers/paystackController.js";

export const paystackRouter = express.Router();

paystackRouter.post("/initialize", initializePayment);
paystackRouter.get("/verify", verifyPayment);
