import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import {
  createBooking,
  getUserBookings,
} from "../controllers/userBooking.controller.js";

const router = Router();

router.post("/", verifyUser, createBooking);
router.get("/my-data", verifyUser, getUserBookings);

export default router;
