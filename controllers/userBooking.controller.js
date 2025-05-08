import { Room } from "../models/room.model.js";
import { UserBooking } from "../models/userBooking.model.js";
import { generateDateList } from "../utls/dateUtils.js";

export const createBooking = async (req, res) => {
  try {
    const rooms = req.body.rooms;
    const booking = new UserBooking({
      user: req.body.user,
      bookedRooms: req.body.rooms,
    });

    const savedBooking = await booking.save();
    const updatePromises = rooms.flatMap((room) =>
      room.rooms.map((roomDetail) =>
        Room.findByIdAndUpdate(
          roomDetail.room,
          {
            $push: {
              "roomNumbers.$[elem].unavailableDates": {
                $each: generateDateList(room.checkInDate, room.checkOutDate),
              },
            },
          },
          {
            arrayFilters: [{ "elem.number": { $in: roomDetail.roomNumbers } }],
          }
        )
      )
    );

    await Promise.all(updatePromises);

    return res.status(200).json(savedBooking);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
