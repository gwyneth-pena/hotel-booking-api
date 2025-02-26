import swaggerAutogen from "swagger-autogen";
import { swaggerSpec } from "./swaggerOptions.js";

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, swaggerSpec);
