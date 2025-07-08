import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import {
  createBooking,
  getUserBookings,
} from "../controllers/userBooking.controller.js";
import { trimRequest } from "../middlewares/trim.middleware.js";

const router = Router();

router.post("/", trimRequest, verifyUser, createBooking);
router.get("/my-data", trimRequest, verifyUser, getUserBookings);

export default router;
