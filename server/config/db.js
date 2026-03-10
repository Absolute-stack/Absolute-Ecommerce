import mongoose from "mongoose";

export async function connectDB() {
  try {
    mongoose.connection.on("connected", () =>
      console.log(`Connected to mongoDB successfully`),
    );
    await mongoose.connect(process.env.DB);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "MongoDB error occured during connection attempt",
    });
  }
}
