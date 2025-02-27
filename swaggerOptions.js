import swaggerJSDoc from "swagger-jsdoc";
import swaggerSchemas from "./swaggerSchemas.js";

const swaggerDefinition = {
  info: {
    title: "Hotel Booking API",
    version: "1.0.0",
    description: "API for booking hotel rooms.",
  },
  components: {
    schemas: swaggerSchemas,
  },
  servers: [
    {
      url: "http://localhost:5000",
    },
    {
      url: "https://hotel-booking-api-alpha.vercel.app",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./index.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
