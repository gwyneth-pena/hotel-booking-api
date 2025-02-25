import { Router } from "express";
import Hotel from "../models/hotel.model.js";
import connectDB from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  await connectDB();
  const hotel = new Hotel(req.body);
  try {
    const savedHotel = await hotel.save();
    res.status(200).json(savedHotel);
  } catch (error) {
    res.status(500).json(`Something went wrong.${error}`);
  }
});

export default router;
