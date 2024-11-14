const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "My API",
      description: "API Documentation",
      version: "1.0.0",
    },
    host: process.env.HOST || "localhost:8080", // Use dynamic host
    basePath: "/",
    schemes: process.env.NODE_ENV === "production" ? ["https"] : ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
