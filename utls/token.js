import { Token } from "../models/token.model.js";

export const saveToken = async (expiryMinutes) => {
  const expiryAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  const resetToken = generateToken();
  await Token({ value: resetToken, expiryAt }).save();
  return resetToken;
};

export const verifyToken = async (token) => {
  let isVerified = false;
  const match = await Token.findOne({ value: token });
  if (match) {
    isVerified = true;
    await Token.findByIdAndDelete(match._id);
  }
  return { isVerified };
};

const generateToken = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
};
