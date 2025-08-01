import { Hotel } from "../models/hotel.model.js";
import { Room } from "../models/room.model.js";
import { generateDateList } from "../utls/dateUtils.js";
import { deleteSupabaseImages } from "../utls/supabase.js";
import mongoose from "mongoose";

export const getHotels = async (req, res) => {
  try {
    const withRoomInfo = req.query.withRoomInfo?.trim();

    let hotels = {};
    if (req.params.id) {
      if (!withRoomInfo) {
        hotels = await Hotel.findById(req.params.id);
      } else {
        hotels = await Hotel.findById(req.params.id).populate('rooms');
      }
    } else {
      const valuesQuery = req.query.values;
      const fieldQuery = req.query.field;
      const countOnly = req.query.countOnly?.trim();
      const minPax = req.query.minPax || 1;

      const checkInDate = req.query.checkInDate
        ? new Date(req.query.checkInDate)
        : new Date(new Date().setUTCHours(0, 0, 0, 0));
      const checkOutDate = req.query.checkOutDate
        ? new Date(req.query.checkOutDate)
        : new Date(new Date().setUTCHours(0, 0, 0, 0));
      if (valuesQuery && fieldQuery) {
        const values = valuesQuery.split(",").map((val) => {
          const trimmedVal = val.trim().toLowerCase();
          if (fieldQuery === "_id") {
            return new mongoose.Types.ObjectId(trimmedVal);
          }
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
        ];

        if (withRoomInfo?.toLowerCase() == "true") {
          const dates = generateDateList(checkInDate, checkOutDate);

          query.push(
            {
              $lookup: {
                from: "rooms",
                localField: "rooms",
                foreignField: "_id",
                as: "roomDetails",
              },
            },
            {
              $addFields: {
                availableRooms: {
                  $filter: {
                    input: "$roomDetails",
                    as: "room",
                    cond: {
                      $gt: [
                        {
                          $size: {
                            $filter: {
                              input: "$$room.roomNumbers",
                              as: "roomNum",
                              cond: {
                                $eq: [
                                  {
                                    $size: {
                                      $setIntersection: [
                                        dates,
                                        "$$roomNum.unavailableDates",
                                      ],
                                    },
                                  },
                                  0,
                                ],
                              },
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                },
              },
            },
            {
              $addFields: {
                availableRooms: {
                  $map: {
                    input: "$availableRooms",
                    as: "room",
                    in: {
                      $mergeObjects: [
                        "$$room",
                        {
                          roomNumbers: {
                            $filter: {
                              input: "$$room.roomNumbers",
                              as: "roomNum",
                              cond: {
                                $eq: [
                                  {
                                    $size: {
                                      $setIntersection: [
                                        dates,
                                        "$$roomNum.unavailableDates",
                                      ],
                                    },
                                  },
                                  0,
                                ],
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              $match: {
                availableRooms: { $ne: [] },
              },
            },
            {
              $addFields: {
                availableMaxPax: {
                  $reduce: {
                    input: "$availableRooms",
                    initialValue: 0,
                    in: { $add: ["$$value", "$$this.maxPeople"] },
                  },
                },
              },
            },
            {
              $match: { availableMaxPax: { $gte: parseInt(minPax) } },
            }
          );
        }

        query.push({
          $group: {
            _id: `$${fieldQuery}`,
            count: { $sum: 1 },
          },
        });

        if (countOnly?.toLowerCase() !== "true") {
          query[query.length - 1].$group.documents = { $push: "$$ROOT" };
        }
        hotels = await Hotel.aggregate(query);
      } else {
        hotels = await Hotel.find();
      }
    }
    return res.status(200).json(hotels);
  } catch (error) {
    console.error(error);
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
    const hotel = await Hotel.findById(req.params.id);

    if (Array.isArray(hotel.rooms) && hotel.rooms.length > 0) {
      await Promise.all(
        hotel.rooms.map((roomId) => Room.findByIdAndDelete(roomId))
      );
    }

    await deleteSupabaseImages(hotel.photos);

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
