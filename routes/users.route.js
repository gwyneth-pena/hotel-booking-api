import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  generateForgotPasswordOTP,
  verifyForgotPasswordOTP,
  updateUser,
  resetPassword,
} from "../controllers/user.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/my-data/:id", verifyUser, getUser);
router.patch("/my-data/:id", verifyUser, updateUser);
router.get("/", verifyAdmin, getUsers);
router.get("/:id", verifyAdmin, getUsers);
router.delete("/:id", verifyAdmin, deleteUser);
router.post("/forgot-password/otp", generateForgotPasswordOTP);
router.post("/forgot-password/verify", verifyForgotPasswordOTP);
router.post("/forgot-password/reset", resetPassword);

export default router;
