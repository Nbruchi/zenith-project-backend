import { Router } from "express";
import { validationMiddleware } from "middlewares/validator.middleware";
import { RegisterDto, LoginDto } from "dtos/auth.dto";
import { checkLoggedIn } from "middlewares/auth.middleware";
import { AuthController } from "controllers/auth.controller";
import { asyncHandler } from "middlewares/asyncHandler.middleware";
const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *       400:
 *         description: Invalid input data
 */
router.post(
    "/register",
    validationMiddleware(RegisterDto),
    asyncHandler(AuthController.register)
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticate user and return JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */
router.post(
    "/login",
    validationMiddleware(LoginDto),
    asyncHandler(AuthController.login)
);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user
 *     description: Get the currently authenticated user's information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
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
 */
router.get("/me", checkLoggedIn, asyncHandler(AuthController.getCurrentUser));

export default router;
