import { Hotel } from "../models/hotel.model.js";
import { Room } from "../models/room.model.js";

export const createRoom = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found." });
    }

    const room = new Room({
      name: req.body.name,
      description: req.body.description,
      photos: req.body.photos,
      maxPeople: req.body.maxPeople,
      price: req.body.price,
      roomNumbers: req.body.roomNumbers,
    });

    const savedRoom = await room.save();

    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: savedRoom._id },
    });

    return res.status(200).json(savedRoom);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    let rooms = {};
    if (req.params.id) {
      rooms = await Room.findById(req.params.id);

      const queryCheckIn = req.query.checkInDate;
      const queryCheckOut = req.query.checkOutDate;

      if (queryCheckIn && queryCheckOut) {
        const checkInDate = queryCheckIn
          ? new Date(queryCheckIn)
          : new Date(new Date().setUTCHours(0, 0, 0, 0));
        const checkOutDate = queryCheckOut
          ? new Date(queryCheckOut)
          : new Date(new Date().setUTCHours(0, 0, 0, 0));

        const availableRoomNumbers = rooms.roomNumbers.filter((roomNumber) => {
          return roomNumber.unavailableDates.every((date) => {
            const d = new Date(date);
            return d < checkInDate || d >= checkOutDate;
          });
        });
        
        rooms = {
          ...rooms.toObject(),
          roomNumbers: availableRoomNumbers,
        };

      }
    } else {
      rooms = await Room.find();
    }
    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(404).json({ message: "Room not found." });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const room = await Room.findByIdAndUpdate(
      roomId,
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          room: req.body.price,
          photos: req.body.photos,
          maxPeople: req.body.maxPeople,
          roomNumbers: req.body.roomNumbers,
        },
      },
      { $new: true }
    );

    return res.status(200).json(room);
  } catch (error) {
    return res.status(404).json({ message: "Room not found." });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found." });

    await Room.findByIdAndDelete(roomId);
    await Hotel.findOneAndUpdate(
      { rooms: roomId },
      {
        $pull: {
          rooms: roomId,
        },
      }
    );

    return res.status(200).json({ message: "Room has been deleted." });
  } catch (error) {
    return res.status(404).json({ message: "Room not found." });
  }
};
