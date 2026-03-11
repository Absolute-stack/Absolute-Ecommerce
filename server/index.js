import "dotenv/config";
import cors from "cors";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/authRoutes.js";
import passport from "./middleware/passport.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:9000",
    withCredentials: true,
  }),
);
app.use(cookieParser());

await connectDB();

app.use("/api/auth", authRouter);
app.use(passport.initialize());
app.get("/", (req, res) => {
  return res.status(200).send("API is running...");
});

app.listen(PORT, () => console.log(`API is running on PORT:${PORT}`));
