import express from "express";
import { upload } from "../middleware/multer.js";
import { protect } from "../middleware/protect.js";
import {
  getMe,
  login,
  register,
  refresh,
  logout,
} from "../controllers/authController.js";

export const authRouter = express.Router();

authRouter.post("/register", upload.array("images", 1), register);
authRouter.post("/refresh", refresh);
authRouter.delete("/logout", logout);
authRouter.post("/login", login);
authRouter.get("/getMe", protect, getMe);
