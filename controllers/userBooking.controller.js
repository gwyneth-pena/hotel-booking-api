import { Room } from "../models/room.model.js";
import { UserBooking } from "../models/userBooking.model.js";
import { generateDateList } from "../utls/dateUtils.js";
import { sendEmail } from "../utls/Email.js";

const sendBookingEmail = (booking) => {
  const to = booking.user.username;
  const name = booking.user.firstName + " " + booking.user.lastName;
  const hotelName = booking.bookedRooms[0].hotel.name;
  const checkIn = booking.bookedRooms[0].checkInDate;
  const checkOut = booking.bookedRooms[0].checkOutDate;
  const rooms = booking.bookedRooms[0].rooms;
  const totalPrice = booking.bookedRooms[0].totalPrice;

  const data = {
    name,
    hotelName,
    checkIn,
    checkOut,
    rooms,
    totalPrice,
    year: new Date().getFullYear(),
  };

  sendEmail(to, "Booking Confirmation", "bookingConfirmation", data);
};

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

    const populatedSavedBooking = await UserBooking.findById(savedBooking._id)
      .populate("user")
      .populate("bookedRooms.hotel")
      .populate("bookedRooms.rooms.room");

    sendBookingEmail(populatedSavedBooking);
    return res.status(200).json(populatedSavedBooking);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.query.userId;

    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    let params = {
      user: userId,
    };

    if (fromDate && toDate) {
      fromDate = new Date(fromDate);
      toDate = new Date(toDate);
      params = {
        ...params,
        bookedRooms: {
          $elemMatch: {
            checkInDate: { $gte: fromDate, $lte: toDate },
          },
        },
      };
    }

    const bookings = await UserBooking.find(params)
      .populate("bookedRooms.hotel")
      .populate("bookedRooms.rooms.room");

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const hotelId = req.query.hotelId;
    const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
    const toDate = req.query.toDate ? new Date(req.query.toDate) : null;

    const params = {};

    if (hotelId || (fromDate && toDate)) {
      params.bookedRooms = {
        $elemMatch: {
          ...(hotelId && { hotel: hotelId }),
          ...(fromDate &&
            toDate && { checkInDate: { $gte: fromDate, $lte: toDate } }),
        },
      };
    }

    const bookings = await UserBooking.find(params)
      .populate("user")
      .populate("bookedRooms.hotel")
      .populate("bookedRooms.rooms.room");

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

