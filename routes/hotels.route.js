import { Router } from "express";
import Hotel from "../models/hotel.model.js";

const router = Router();

router.get("/:id?", async (req, res) => {
  try {
    let hotels = {};
    if (req.params.id) {
      hotels = await Hotel.findById(req.params.id);
    } else {
      hotels = await Hotel.find();
    }
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json(`Something went wrong.${error}`);
  }
});

router.post("/", async (req, res) => {
  const hotel = new Hotel(req.body);
  try {
    const savedHotel = await hotel.save();
    res.status(200).json(savedHotel);
  } catch (error) {
    res.status(500).json(`Something went wrong.${error}`);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json(`Something went wrong.${error}`);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Hotel has been deleted." });
  } catch (error) {
    res.status(500).json(`Something went wrong.${error}`);
  }
});

export default router;
