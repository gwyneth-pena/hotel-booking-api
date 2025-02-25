import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import usersRoute from "./routes/users.route.js";
import hotelsRoute from "./routes/hotels.route.js";
import { createServer } from "@vercel/node";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", usersRoute);
app.use("/hotels", hotelsRoute);

connectDB();

app.listen(port, () => {
  console.log(`API listening on port: ${port}`);
});

export default createServer(app);