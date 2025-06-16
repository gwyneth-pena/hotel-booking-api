import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      required: true,
      default: 0,
    },
    expiryAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: false }
);

export const OTP = mongoose.model("OTP", OTPSchema);
