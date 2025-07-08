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
import {
  verifyAdmin,
  verifyAdminOrUser,
  verifyUser,
} from "../middlewares/auth.middleware.js";
import { trimRequest } from "../middlewares/trim.middleware.js";

const router = Router();

router.get("/my-data/:id", trimRequest, verifyAdminOrUser, getUser);
router.patch("/my-data/:id", trimRequest, verifyUser, updateUser);
router.get("/", trimRequest, verifyAdmin, getUsers);
router.get("/:id", trimRequest, verifyAdmin, getUsers);
router.delete("/:id", trimRequest, verifyAdmin, deleteUser);
router.post("/forgot-password/otp", trimRequest, generateForgotPasswordOTP);
router.post("/forgot-password/verify", trimRequest, verifyForgotPasswordOTP);
router.post("/forgot-password/reset", trimRequest, resetPassword);

export default router;
