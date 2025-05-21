import { Router } from "express";
import { UserController } from "controllers/user.controllers";
import { validationMiddleware } from "middlewares/validator.middleware";
import { UpdateProfileDto, UpdatePasswordDto } from "dtos/auth.dto";
import { checkLoggedIn, checkAdmin } from "middlewares/auth.middleware";
import { asyncHandler } from "middlewares/asyncHandler.middleware";

const router = Router();

/**
 * @swagger
 * /api/v1/users/profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile
 *     description: Update the currently authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileDto'
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
router.put(
    "/profile",
    checkLoggedIn,
    validationMiddleware(UpdateProfileDto),
    asyncHandler(UserController.updateProfile)
);

/**
 * @swagger
 * /api/v1/users/password:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user password
 *     description: Update the currently authenticated user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordDto'
 *     responses:
 *       200:
 *         description: Password updated successfully
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
 *       400:
 *         description: Invalid input data
 */
router.put(
    "/password",
    checkLoggedIn,
    validationMiddleware(UpdatePasswordDto),
    asyncHandler(UserController.updatePassword)
);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
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
 *       403:
 *         description: Not authorized (admin only)
 */
router.get(
    "/",
    checkLoggedIn,
    checkAdmin,
    asyncHandler(UserController.getUsers)
);

export default router;
