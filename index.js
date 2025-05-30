import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import hotelsRoutes from "./routes/hotels.route.js";
import authRoutes from "./routes/auth.route.js";
import usersRoutes from "./routes/users.route.js";
import roomsRoutes from './routes/room.route.js';
import bookingRoutes from './routes/userBooking.route.js';
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from './swagger-output.json' with { type: "json" };
import cookieParser from "cookie-parser";

dotenv.config();
const SWAGGER_CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"
const port = process.env.PORT || 5000;
const app = express();

const allowedOrigins = [
  'https://hotel-booking-delta-two.vercel.app',
  'http://localhost:5173'
]


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/hotels", hotelsRoutes);
app.use("/rooms", roomsRoutes);
app.use("/booking", bookingRoutes);
app.use("/users", usersRoutes);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile, {
  
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: SWAGGER_CSS_URL,
})
);

connectDB();

app.listen(port, () => {
  console.log(`API listening on port: ${port}`);
});

export default app;
