import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Hotel Booking API",
  },
  host: "localhost:5000",
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
