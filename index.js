import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import hotelsRoutes from "./routes/hotels.route.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from './swagger-output.json' with { type: "json" };

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/auth", authRoutes);
app.use("/hotels", hotelsRoutes);

connectDB();

app.listen(port, () => {
  console.log(`API listening on port: ${port}`);
});

export default app;
