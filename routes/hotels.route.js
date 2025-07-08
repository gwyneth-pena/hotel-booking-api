import { Router } from "express";
import {
  createHotel,
  deleteHotel,
  getHotels,
  updateHotel,
} from "../controllers/hotel.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { trimRequest } from "../middlewares/trim.middleware.js";

const router = Router();

router.post("/", trimRequest, verifyAdmin, createHotel);
router.get("/", trimRequest, getHotels);
router.get("/:id", trimRequest, getHotels);
router.patch("/:id", trimRequest, verifyAdmin, updateHotel);
router.delete("/:id", trimRequest, verifyAdmin, deleteHotel);

export default router;
