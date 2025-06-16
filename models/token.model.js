import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },
    expiryAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: false }
);

export const Token = mongoose.model("Token", TokenSchema);
