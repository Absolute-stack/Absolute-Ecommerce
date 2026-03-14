import "dotenv/config";
import cors from "cors";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import passport from "./middleware/passport.js";
import { authRouter } from "./routes/authRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { paystackRouter } from "./routes/paystackRoutes.js";
import { payStackWebhook } from "./controllers/paystackController.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  "/api/paystack/webhook",
  express.raw({ type: "application/json" }),
  payStackWebhook,
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:9000", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(passport.initialize());

await connectDB();

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/paystack", paystackRouter);

app.get("/", (req, res) => {
  return res.status(200).send("API is running...");
});

app.listen(PORT, () => console.log(`API is running on PORT:${PORT}`));
