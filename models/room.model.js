import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      require: true,
    },
    photos: {
      type: [String],
    },
    maxPeople: {
      type: Number,
      default: 1,
    },
    roomNumbers: [
      {
        number: Number,
        unavailableDates: [Date],
      },
    ],
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", RoomSchema);
