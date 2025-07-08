import { Router } from "express";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  deleteRoom,
  createRoom,
  getRooms,
  updateRoom,
} from "../controllers/room.controller.js";
import { trimRequest } from "../middlewares/trim.middleware.js";

const router = Router();

router.post("/:hotelId",trimRequest ,verifyAdmin, createRoom);
router.get("/", trimRequest,getRooms);
router.get("/:id", trimRequest, getRooms);
router.patch("/:id", trimRequest, verifyAdmin, updateRoom);
router.delete("/:id", trimRequest, verifyAdmin, deleteRoom);

export default router;
