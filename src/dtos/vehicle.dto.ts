import {
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    Matches,
} from "class-validator";
import { Transform } from "class-transformer";

export enum VehicleType {
    CAR = "CAR",
    TRUCK = "TRUCK",
    MOTORCYCLE = "MOTORCYCLE",
}

export enum Size {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE",
}

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleDto:
 *       type: object
 *       required:
 *         - plateNumber
 *         - model
 *         - color
 *         - vehicleType
 *         - size
 *       properties:
 *         plateNumber:
 *           type: string
 *           description: Vehicle's license plate number
 *         model:
 *           type: string
 *           description: Vehicle's model
 *         color:
 *           type: string
 *           description: Vehicle's color
 *         vehicleType:
 *           type: string
 *           enum: [CAR, TRUCK, MOTORCYCLE]
 *           description: Type of vehicle
 *         size:
 *           type: string
 *           enum: [SMALL, MEDIUM, LARGE]
 *           description: Size of vehicle
 */
export class VehicleDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) =>
        typeof value === "string" ? value.trim() : value
    )
    @Matches(/^RA[A-Z][0-9]{3}[A-Z]$/, {
        message:
            "Plate number must follow the format RA[A-G][0-9]{3}[A-Z], e.g., RAH123U",
    })
    plateNumber!: string;

    @IsEnum(VehicleType)
    vehicleType!: VehicleType;

    @IsEnum(Size)
    size!: Size;

    @IsObject()
    @IsOptional()
    attributes?: Record<string, any>;

    @IsString()
    @IsNotEmpty()
    model!: string;

    @IsString()
    @IsNotEmpty()
    color!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateVehicleDto:
 *       type: object
 *       properties:
 *         plateNumber:
 *           type: string
 *           description: Vehicle's license plate number
 *         model:
 *           type: string
 *           description: Vehicle's model
 *         color:
 *           type: string
 *           description: Vehicle's color
 */
export class UpdateVehicleDto {
    @IsString()
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === "string" ? value.trim() : value
    )
    @Matches(/^RA[A-G][0-9]{3}[A-Z]$/, {
        message:
            "Plate number must follow the format RA[A-G][0-9]{3}[A-Z], e.g., RAH123U",
    })
    plateNumber?: string;

    @IsEnum(VehicleType)
    @IsOptional()
    vehicleType?: VehicleType;

    @IsEnum(Size)
    @IsOptional()
    size?: Size;

    @IsObject()
    @IsOptional()
    attributes?: Record<string, any>;

    @IsString()
    @IsOptional()
    model?: string;

    @IsString()
    @IsOptional()
    color?: string;
}
