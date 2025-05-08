import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { createBooking } from "../controllers/userBooking.controller.js";


const router = Router();

router.post("/", verifyUser, createBooking);


export default router;
