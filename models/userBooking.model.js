import mongoose, { Schema } from "mongoose";

const bookingStatusEnum = [
  "pending",
  "confirmed",
  "cancelled",
];


const UserBookingSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookedRooms: [
    {
      hotel: {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
      },
      rooms: [
        {
          room: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true,
          },
          roomNumbers: {
            type: [Number],
            required: true
          },
        },
      ],
      checkInDate: {
        type: Date,
        required: true,
      },
      checkOutDate: {
        type: Date,
        required: true,
      },
      totalPrice: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        default: 0.0,
      },
      status: {
        type: String,
        enum: bookingStatusEnum,
        default: "pending",
        required: true,
      },
    },
  ],
});

UserBookingSchema.index({ user: 1 });
UserBookingSchema.index({ "bookedRooms.hotel": 1 });
UserBookingSchema.index({ "bookedRooms.checkInDate": 1 });
UserBookingSchema.index({ "bookedRooms.checkOutDate": 1 });

export const UserBooking = mongoose.model("UserBooking", UserBookingSchema);
