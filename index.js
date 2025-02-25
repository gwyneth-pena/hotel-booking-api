import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import usersRoute from "./routes/users.route.js";
import hotelsRoute from "./routes/hotels.route.js";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use("/auth", usersRoute);
app.use("/hotels", hotelsRoute);

app.listen(port, () => {
  connectDB();
  console.log(`API listening on port: ${port}`);
});

module.exports = app;