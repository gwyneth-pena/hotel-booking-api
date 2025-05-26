import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import dayjs from "dayjs";

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: false,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      partialsDir: path.resolve("./templates/"),
      layoutsDir: path.resolve("./templates/"),
      defaultLayout: "",
      helpers: {
        getRoomName: function (roomWrapper) {
          return roomWrapper && roomWrapper.room ? roomWrapper.room.name : "";
        },
        getNumberOfRooms: function (roomWrapper) {
          return roomWrapper && roomWrapper.room ? roomWrapper.roomNumbers.length : "";
        },
        json: function (context) {
          return JSON.stringify(context, null, 2);
        },
        formatDate: (date, format) => {
          return dayjs(date).format(format);
        },
      },
    },
    viewPath: path.resolve("./templates/"),
    extName: ".hbs",
  })
);

export const sendEmail = async (
  to,
  name,
  hotelName,
  checkIn,
  checkOut,
  rooms,
  totalPrice
) => {
  transporter.sendMail({
    from: emailUser,
    to: to,
    subject: "Booking Confirmation",
    template: "bookingConfirmation",
    context: {
      name: name,
      hotelName: hotelName,
      checkIn: checkIn,
      checkOut: checkOut,
      rooms: rooms,
      totalPrice: totalPrice,
      year: new Date().getFullYear(),
    },
  });
};
