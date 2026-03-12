import express from "express";
import { upload } from "../middleware/multer.js";
import { protect } from "../middleware/protect.js";
import {
  getMe,
  login,
  register,
  refresh,
  logout,
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../controllers/authController.js";
import passport from "../middleware/passport.js";

export const authRouter = express.Router();

authRouter.post("/register", upload.single("image"), register);
authRouter.get("/refresh", refresh);
authRouter.delete("/logout", logout);
authRouter.post("/login", login);
authRouter.get("/getMe", protect, getMe);

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const user = req.user;
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.redirect(`${process.env.API_URL}/oauth?token=${accessToken}`);
  },
);
