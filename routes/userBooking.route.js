import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middlewares/auth.middleware.js";
import {
  createBooking,
  getBookings,
  getUserBookings,
} from "../controllers/userBooking.controller.js";
import { trimRequest } from "../middlewares/trim.middleware.js";

const router = Router();

router.post("/", trimRequest, verifyUser, createBooking);
router.get("/", trimRequest, verifyAdmin, getBookings);
router.get("/my-data", trimRequest, verifyUser, getUserBookings);

export default router;
