import { Hotel } from "../models/hotel.model.js";

export const getHotels = async (req, res) => {
  try {
    let hotels = {};
    if (req.params.id) {
      hotels = await Hotel.findById(req.params.id);
    } else {
      const valuesQuery = req.query.values;
      const fieldQuery = req.query.field;
      const countOnly = req.query.countOnly?.trim();
      const withRoomInfo = req.query.withRoomInfo?.trim();
      if (valuesQuery && fieldQuery) {
        const values = valuesQuery.split(",").map((val) => {
          const trimmedVal = val.trim().toLowerCase();
          if (trimmedVal === "true") return true;
          if (trimmedVal === "false") return false;
          if (!isNaN(trimmedVal)) return Number(trimmedVal);
          return new RegExp(val.trim(), "i");
        });

        let query = [
          {
            $match: {
              [fieldQuery]: { $in: values },
            },
          },
          {
            $group: {
              _id: `$${fieldQuery}`,
              count: { $sum: 1 },
            },
          },
        ];

        if (withRoomInfo?.toLowerCase() == "true") {
          query.push({
            $lookup: {
              from: "rooms",
              localField: "rooms",
              foreignField: "id",
              as: "roomDetails",
            },
          });
        }

        if (countOnly?.toLowerCase() !== "true") {
          query[1].$group.documents = { $push: "$$ROOT" };
        }
        hotels = await Hotel.aggregate(query);
      } else {
        hotels = await Hotel.find();
      }
    }
    return res.status(200).json(hotels);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Hotel not found." });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          type: req.body.type,
          description: req.body.description,
          photos: req.body.photos,
          city: req.body.city,
          address: req.body.address,
          rating: req.body.rating,
          rooms: req.body.rooms,
          isFeatured: req.body.isFeatured,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json(hotel);
  } catch (error) {
    return res.status(404).json({ message: "Hotel not found." });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Hotel has been deleted." });
  } catch (error) {
    return res.status(404).json({ message: "Hotel not found." });
  }
};

export const createHotel = async (req, res) => {
  try {
    const hotel = new Hotel({
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      photos: req.body.photos,
      city: req.body.city,
      address: req.body.address,
      rating: req.body.rating,
      rooms: req.body.rooms,
      isFeatured: req.body.isFeatured,
    });
    const savedHotel = await hotel.save();
    return res.status(200).json(savedHotel);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
