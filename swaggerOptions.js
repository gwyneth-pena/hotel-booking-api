import swaggerJSDoc from "swagger-jsdoc";
import swaggerSchemas from "./swaggerSchemas.js";

const swaggerDefinition = {
  info: {
    title: "Hotel API",
    version: "1.0.0",
    description: "API for managing hotels",
  },
  components: {
    schemas: swaggerSchemas,
  },
};

const options = {
  swaggerDefinition,
  apis: ["./index.js"]
};

export const swaggerSpec = swaggerJSDoc(options);
