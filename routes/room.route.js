import { Router } from "express";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  deleteRoom,
  createRoom,
  getRooms,
  updateRoom,
} from "../controllers/room.controller.js";

const router = Router();

router.post("/:hotelId", verifyAdmin, createRoom);
router.get("/", getRooms);
router.get("/:id", getRooms);
router.patch("/:id", verifyAdmin, updateRoom);
router.delete("/:id", verifyAdmin, deleteRoom);

export default router;
