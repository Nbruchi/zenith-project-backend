import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Zenith Parking API Documentation",
            version: "1.0.0",
            description: "API documentation for the Zenith Parking System",
            contact: {
                name: "API Support",
                email: "support@zenithparking.com",
            },
        },
        servers: [
            {
                url: process.env.API_URL || "http://localhost:8000",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/dtos/*.ts"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
