import { Router } from "express";
import { VehicleController } from "controllers/vehicle.controllers";
import { validationMiddleware } from "middlewares/validator.middleware";
import { VehicleDto, UpdateVehicleDto } from "dtos/vehicle.dto";
import { checkLoggedIn } from "middlewares/auth.middleware";
import { asyncHandler } from "middlewares/asyncHandler.middleware";
const vehicleRoute = Router();

/**
 * @swagger
 * /api/v1/vehicles:
 *   post:
 *     tags:
 *       - Vehicles
 *     summary: Create a new vehicle
 *     description: Register a new vehicle for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleDto'
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Not authenticated
 *       400:
 *         description: Invalid input data
 */
vehicleRoute.post(
    "/",
    checkLoggedIn,
    validationMiddleware(VehicleDto),
    asyncHandler(VehicleController.createVehicle)
);

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   put:
 *     tags:
 *       - Vehicles
 *     summary: Update a vehicle
 *     description: Update an existing vehicle's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVehicleDto'
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Vehicle not found
 */
vehicleRoute.put(
    "/:id",
    checkLoggedIn,
    validationMiddleware(UpdateVehicleDto),
    asyncHandler(VehicleController.updateVehicle)
);

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   delete:
 *     tags:
 *       - Vehicles
 *     summary: Delete a vehicle
 *     description: Remove a vehicle from the user's account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Vehicle not found
 */
vehicleRoute.delete(
    "/:id",
    checkLoggedIn,
    asyncHandler(VehicleController.deleteVehicle)
);

/**
 * @swagger
 * /api/v1/vehicles:
 *   get:
 *     tags:
 *       - Vehicles
 *     summary: Get all vehicles
 *     description: Retrieve all vehicles for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Not authenticated
 */
vehicleRoute.get(
    "/",
    checkLoggedIn,
    asyncHandler(VehicleController.getVehicles)
);

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   get:
 *     tags:
 *       - Vehicles
 *     summary: Get vehicle by ID
 *     description: Retrieve a specific vehicle's details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Vehicle not found
 */
vehicleRoute.get(
    "/:id",
    checkLoggedIn,
    asyncHandler(VehicleController.getVehicleById)
);

export default vehicleRoute;
