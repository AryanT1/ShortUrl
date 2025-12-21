import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Short URL API",
      version: "1.0.0",
    },
  },
  // Files where you will write @swagger JSDoc blocks
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/*.ts"],
});
