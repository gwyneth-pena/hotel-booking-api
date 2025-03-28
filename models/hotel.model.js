import {mongoose, Schema} from "mongoose";

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    rooms: { type: Schema.Types.ObjectId, ref: "Room" },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

HotelSchema.index({ rooms: 1 });

export const Hotel = mongoose.model("Hotel", HotelSchema);
