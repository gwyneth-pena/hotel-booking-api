import { Hotel } from "./models/hotel.model.js";
import { User, UserLogin } from "./models/user.model.js";
import m2s from "mongoose-to-swagger";
import { UserBooking } from "./models/userBooking.model.js";

export default {
  user: m2s(User, { omitMongooseInternals: true, omitFields: ["_id"] }),
  userLogin: m2s(UserLogin, {
    omitMongooseInternals: true,
    omitFields: ["_id"],
  }),
  hotel: m2s(Hotel, { omitMongooseInternals: true, omitFields: ["_id"] }),
  userBooking: m2s(UserBooking, { omitMongooseInternals: true, omitFields: ["_id"] }),
};
