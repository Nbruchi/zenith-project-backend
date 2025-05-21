import { Router } from "express";
import { validationMiddleware } from "middlewares/validator.middleware";
import {
    SlotRequestDto,
    UpdateSlotRequestDto,
    ApproveSlotRequestDto,
    RejectSlotRequestDto,
} from "dtos/parking.dto";
import { checkLoggedIn, checkAdmin } from "middlewares/auth.middleware";
import { SlotRequestController } from "controllers/slotRequest.controllers";
import { asyncHandler } from "middlewares/asyncHandler.middleware";
const router = Router();

/**
 * @swagger
 * /api/v1/slot-requests:
 *   post:
 *     tags:
 *       - Slot Requests
 *     summary: Create a slot request
 *     description: Request a parking slot for a specific time period
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SlotRequestDto'
 *     responses:
 *       201:
 *         description: Slot request created successfully
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
router.post(
    "/",
    checkLoggedIn,
    validationMiddleware(SlotRequestDto),
    asyncHandler(SlotRequestController.createSlotRequest)
);

/**
 * @swagger
 * /api/v1/slot-requests/{id}:
 *   put:
 *     tags:
 *       - Slot Requests
 *     summary: Update a slot request
 *     description: Update an existing slot request's time period
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Slot request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSlotRequestDto'
 *     responses:
 *       200:
 *         description: Slot request updated successfully
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
 *         description: Slot request not found
 */
router.put(
    "/:id",
    checkLoggedIn,
    validationMiddleware(UpdateSlotRequestDto),
    asyncHandler(SlotRequestController.updateSlotRequest)
);

/**
 * @swagger
 * /api/v1/slot-requests/{id}:
 *   delete:
 *     tags:
 *       - Slot Requests
 *     summary: Delete a slot request
 *     description: Cancel a slot request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Slot request ID
 *     responses:
 *       200:
 *         description: Slot request deleted successfully
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
 *         description: Slot request not found
 */
router.delete(
    "/:id",
    checkLoggedIn,
    asyncHandler(SlotRequestController.deleteSlotRequest)
);

/**
 * @swagger
 * /api/v1/slot-requests/{id}/approve:
 *   put:
 *     tags:
 *       - Slot Requests
 *     summary: Approve a slot request
 *     description: Approve a slot request (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Slot request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveSlotRequestDto'
 *     responses:
 *       200:
 *         description: Slot request approved successfully
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
 *         description: Slot request not found
 */
router.put(
    "/:id/approve",
    checkLoggedIn,
    checkAdmin,
    validationMiddleware(ApproveSlotRequestDto),
    asyncHandler(SlotRequestController.approveSlotRequest)
);

/**
 * @swagger
 * /api/v1/slot-requests/{id}/reject:
 *   put:
 *     tags:
 *       - Slot Requests
 *     summary: Reject a slot request
 *     description: Reject a slot request (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Slot request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RejectSlotRequestDto'
 *     responses:
 *       200:
 *         description: Slot request rejected successfully
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
 *         description: Slot request not found
 */
router.put(
    "/:id/reject",
    checkLoggedIn,
    checkAdmin,
    validationMiddleware(RejectSlotRequestDto),
    asyncHandler(SlotRequestController.rejectSlotRequest)
);

/**
 * @swagger
 * /api/v1/slot-requests:
 *   get:
 *     tags:
 *       - Slot Requests
 *     summary: Get all slot requests
 *     description: Retrieve a list of all slot requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of slot requests retrieved successfully
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
router.get(
    "/",
    checkLoggedIn,
    asyncHandler(SlotRequestController.getSlotRequests)
);

export default router;
