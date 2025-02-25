import { Router } from "express";
import Hotel from "../models/hotel.model.js";

const router = Router();

router.post("/", async (req, res) => {
  const hotel = new Hotel(req.body);
  try {
    const savedHotel = await hotel.save();
    res.status(200).json(savedHotel);
  } catch (error) {
    console.log(error)
    res.status(500).json(`Something went wrong.v${error}`);
  }
});

export default router;
