import "reflect-metadata"; // Add this at the top
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import parkingRoutes from "./routes/parking.routes";
import slotRequestRoutes from "./routes/slotRequest.routes";

dotenv.config();
const app = express();

// Configure CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/parking-slots", parkingRoutes);
app.use("/api/v1/slot-requests", slotRequestRoutes);

// Error handling middleware
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error("Error:", err);
        res.status(err.status || 500).json({
            success: false,
            message: err.message || "Internal server error",
            error: process.env.NODE_ENV === "development" ? err : {},
        });
    }
);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(
        `Swagger documentation available at http://localhost:${PORT}/api-docs`
    );
});
