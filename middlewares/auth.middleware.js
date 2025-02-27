import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

dotenv.config();

export const verifyAdmin = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized Access" });
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(data.id);
    if (!user.isAdmin) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized Access" });
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(data.id);
    if (!user.isAdmin) {
      next();
    }
    return res.status(401).json({ message: "Unauthorized Access" });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};