import { Router } from "express";
import {
  createHotel,
  deleteHotel,
  getHotels,
  updateHotel,
} from "../controllers/hotel.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyAdmin, createHotel);
router.get("/", getHotels);
router.get("/:id", getHotels);
router.patch("/:id", verifyAdmin, updateHotel);
router.delete("/:id", verifyAdmin, deleteHotel);

export default router;
