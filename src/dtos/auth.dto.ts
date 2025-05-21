import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsOptional,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User's password (minimum 6 characters)
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 */
export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    name!: string; // Add ! to assert definite assignment

    @IsEmail()
    email!: string; // Add !

    @IsString()
    @MinLength(6)
    password!: string; // Add !
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password
 */
export class LoginDto {
    @IsEmail()
    email!: string; // Add !

    @IsString()
    @IsNotEmpty()
    password!: string; // Add !
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfileDto:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 */
export class UpdateProfileDto {
    @IsString()
    @IsNotEmpty()
    name?: string; // Already optional, no change needed

    @IsEmail()
    @IsOptional()
    email?: string; // Already optional

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePasswordDto:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: User's current password
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           description: User's new password (minimum 6 characters)
 */
export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    currentPassword!: string; // Add !

    @IsString()
    @MinLength(6)
    newPassword!: string; // Add !
}
