import { Router } from "express";
import {
  createHotel,
  deleteHotel,
  getHotels,
  updateHotel,
} from "../controllers/hotel.controller.js";

const router = Router();

router.post("/", createHotel);
router.get("/:id?", getHotels);
router.put("/:id", updateHotel);
router.delete("/:id", deleteHotel);

export default router;
