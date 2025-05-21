import { Router } from "express";
import { validationMiddleware } from "middlewares/validator.middleware";
import {
    BulkSlotDto,
    CreateSlotDto,
    SlotDto,
    UpdateSlotDto,
} from "dtos/parking.dto";
import { checkLoggedIn, checkAdmin } from "middlewares/auth.middleware";
import { ParkingSlotController } from "controllers/parking.controllers";
import { asyncHandler } from "middlewares/asyncHandler.middleware";
const router = Router();

/**
 * @swagger
 * /api/v1/parking-slots/bulk:
 *   post:
 *     tags:
 *       - Parking Slots
 *     summary: Create multiple parking slots
 *     description: Create multiple parking slots at once (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkSlotDto'
 *     responses:
 *       201:
 *         description: Parking slots created successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 *       400:
 *         description: Invalid input data
 */
router.post(
    "/bulk",
    checkLoggedIn,
    checkAdmin,
    validationMiddleware(BulkSlotDto),
    asyncHandler(ParkingSlotController.createSlots)
);

/**
 * @swagger
 * /api/v1/parking-slots:
 *   post:
 *     tags:
 *       - Parking Slots
 *     summary: Create a parking slot
 *     description: Create a single parking slot (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSlotDto'
 *     responses:
 *       201:
 *         description: Parking slot created successfully
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
 *       403:
 *         description: Not authorized (admin only)
 *       400:
 *         description: Invalid input data
 */
router.post(
    "/",
    checkLoggedIn,
    checkAdmin,
    validationMiddleware(CreateSlotDto),
    asyncHandler(ParkingSlotController.createSlot)
);

/**
 * @swagger
 * /api/v1/parking-slots/{id}:
 *   put:
 *     tags:
 *       - Parking Slots
 *     summary: Update a parking slot
 *     description: Update an existing parking slot's information (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parking slot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSlotDto'
 *     responses:
 *       200:
 *         description: Parking slot updated successfully
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
 *       403:
 *         description: Not authorized (admin only)
 *       404:
 *         description: Parking slot not found
 */
router.put(
    "/:id",
    checkLoggedIn,
    checkAdmin,
    validationMiddleware(UpdateSlotDto),
    asyncHandler(ParkingSlotController.updateSlot)
);

/**
 * @swagger
 * /api/v1/parking-slots/{id}:
 *   delete:
 *     tags:
 *       - Parking Slots
 *     summary: Delete a parking slot
 *     description: Remove a parking slot (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parking slot ID
 *     responses:
 *       200:
 *         description: Parking slot deleted successfully
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
 *       403:
 *         description: Not authorized (admin only)
 *       404:
 *         description: Parking slot not found
 */
router.delete(
    "/:id",
    checkLoggedIn,
    checkAdmin,
    asyncHandler(ParkingSlotController.deleteSlot)
);

/**
 * @swagger
 * /api/v1/parking-slots:
 *   get:
 *     tags:
 *       - Parking Slots
 *     summary: Get all parking slots
 *     description: Retrieve a list of all parking slots
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of parking slots retrieved successfully
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
router.get("/", checkLoggedIn, asyncHandler(ParkingSlotController.getSlots));

export default router;
