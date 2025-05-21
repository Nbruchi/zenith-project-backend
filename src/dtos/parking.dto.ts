import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
    IsUUID,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    IsNumber,
    IsArray,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Size, VehicleType } from "./vehicle.dto";

export enum SlotStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    MAINTENANCE = "MAINTENANCE",
    RESERVED = "RESERVED",
}

@ValidatorConstraint({ name: "DateRangeValidator", async: false })
class DateRangeValidator implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments): boolean {
        const { startDate, endDate } = args.object as {
            startDate?: string;
            endDate?: string;
        };
        const now = new Date();

        if (value && args.property === "startDate") {
            const start = new Date(value);
            return start >= now;
        }

        if (value && args.property === "endDate" && startDate) {
            const end = new Date(value);
            const start = new Date(startDate);
            return end >= start;
        }

        return true;
    }

    defaultMessage(args: ValidationArguments): string {
        if (args.property === "startDate") {
            return "startDate must not be earlier than the current date and time";
        }
        return "endDate must not be earlier than startDate";
    }
}

function ValidateDateRange() {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "ValidateDateRange",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: { message: `Invalid ${propertyName}` },
            validator: DateRangeValidator,
        });
    };
}

export class GetSlotRequestsQueryDto {
    @IsNumberString()
    @IsOptional()
    page?: string = "1";

    @IsNumberString()
    @IsOptional()
    limit?: string = "10";

    @IsString()
    @IsOptional()
    search?: string;

    @IsString()
    @IsOptional()
    status?: string;
}

export const PARKING_RATE_PER_30MIN = 500; // 500 RWF per 30 minutes

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateSlotDto:
 *       type: object
 *       required:
 *         - slotNumber
 *         - level
 *         - status
 *       properties:
 *         slotNumber:
 *           type: string
 *           description: Unique identifier for the parking slot
 *         level:
 *           type: string
 *           description: Floor level of the parking slot
 *         status:
 *           type: string
 *           enum: [AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE]
 *           description: Current status of the parking slot
 */
export class CreateSlotDto {
    @IsString()
    @IsNotEmpty()
    slotNumber!: string;

    @IsString()
    @IsNotEmpty()
    level!: string;

    @IsEnum(["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"])
    status!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     BulkSlotDto:
 *       type: object
 *       required:
 *         - slots
 *       properties:
 *         slots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateSlotDto'
 *           description: Array of parking slots to create
 */
export class BulkSlotDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSlotDto)
    slots!: CreateSlotDto[];
}

export class SlotDto {
    @IsString()
    @IsNotEmpty()
    slotNumber!: string;

    @IsEnum(VehicleType)
    @IsNotEmpty()
    vehicleType!: VehicleType;

    @IsEnum(Size)
    @IsNotEmpty()
    size!: Size;

    @IsEnum(Location)
    @IsNotEmpty()
    location!: Location;

    @IsEnum(SlotStatus)
    @IsNotEmpty()
    status!: SlotStatus;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateSlotDto:
 *       type: object
 *       properties:
 *         slotNumber:
 *           type: string
 *           description: Unique identifier for the parking slot
 *         level:
 *           type: string
 *           description: Floor level of the parking slot
 *         status:
 *           type: string
 *           enum: [AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE]
 *           description: Current status of the parking slot
 */
export class UpdateSlotDto {
    @IsString()
    @IsOptional()
    slotNumber?: string;

    @IsString()
    @IsOptional()
    level?: string;

    @IsEnum(["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"])
    @IsOptional()
    status?: string;
}

export class GetSlotsQueryDto {
    @IsString()
    @IsOptional()
    page?: string = "1";

    @IsString()
    @IsOptional()
    limit?: string = "10";

    @IsString()
    @IsOptional()
    search?: string;

    @IsEnum(SlotStatus)
    @IsOptional()
    status?: SlotStatus;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SlotRequestDto:
 *       type: object
 *       required:
 *         - vehicleId
 *         - slotId
 *         - startTime
 *         - endTime
 *       properties:
 *         vehicleId:
 *           type: string
 *           description: ID of the vehicle requesting the slot
 *         slotId:
 *           type: string
 *           description: ID of the requested parking slot
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the parking request
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the parking request
 */
export class SlotRequestDto {
    @IsString()
    @IsNotEmpty()
    vehicleId!: string;

    @IsString()
    @IsNotEmpty()
    slotId!: string;

    @IsString()
    @IsNotEmpty()
    startTime!: string;

    @IsString()
    @IsNotEmpty()
    endTime!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateSlotRequestDto:
 *       type: object
 *       properties:
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the parking request
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the parking request
 */
export class UpdateSlotRequestDto {
    @IsString()
    @IsOptional()
    startTime?: string;

    @IsString()
    @IsOptional()
    endTime?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ApproveSlotRequestDto:
 *       type: object
 *       required:
 *         - adminNotes
 *       properties:
 *         adminNotes:
 *           type: string
 *           description: Notes from the admin regarding the approval
 */
export class ApproveSlotRequestDto {
    @IsString()
    @IsNotEmpty()
    adminNotes!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RejectSlotRequestDto:
 *       type: object
 *       required:
 *         - adminNotes
 *       properties:
 *         adminNotes:
 *           type: string
 *           description: Notes from the admin regarding the rejection
 */
export class RejectSlotRequestDto {
    @IsString()
    @IsNotEmpty()
    adminNotes!: string;
}
