import { Router } from "express";
import { login, logout, signup } from "../controllers/user.controller.js";
import { trimRequest } from "../middlewares/trim.middleware.js";

const router = Router();

router.post("/signup", trimRequest, signup);
router.post("/login", trimRequest, login);
router.post("/logout", trimRequest, logout);


export default router;
