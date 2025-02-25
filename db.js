import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Mongo DB connected!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
