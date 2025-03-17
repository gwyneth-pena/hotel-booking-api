import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.controller.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/my-data/:id", verifyUser, getUser);
router.patch("/my-data/:id", verifyUser, getUser);
router.get("/", verifyAdmin, getUsers);
router.get("/:id", verifyAdmin, getUsers);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
