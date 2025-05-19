import { IsDateString, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, IsNumber } from 'class-validator';
import { Location, Size, SlotStatus, VehicleType } from '@prisma/client';
import { ValidateIf } from 'class-validator';

@ValidatorConstraint({ name: 'DateRangeValidator', async: false })
class DateRangeValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const { startDate, endDate } = args.object as { startDate?: string; endDate?: string };
    const now = new Date();
    
    if (value && args.property === 'startDate') {
      const start = new Date(value);
      return start >= now;
    }
    
    if (value && args.property === 'endDate' && startDate) {
      const end = new Date(value);
      const start = new Date(startDate);
      return end >= start;
    }
    
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    if (args.property === 'startDate') {
      return 'startDate must not be earlier than the current date and time';
    }
    return 'endDate must not be earlier than startDate';
  }
}

function ValidateDateRange() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateDateRange',
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
  page?: string = '1';

  @IsNumberString()
  @IsOptional()
  limit?: string = '10';

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export const PARKING_RATE_PER_30MIN = 500; // 500 RWF per 30 minutes

export class CreateSlotDto {
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
  @IsOptional()
  status?: SlotStatus = SlotStatus.AVAILABLE; // Default to AVAILABLE
}

export class BulkSlotDto {
  @IsNumber()
  @IsNotEmpty()
  count!: number;

  @IsString()
  @IsNotEmpty()
  prefix!: string;

  @IsEnum(VehicleType)
  @IsNotEmpty()
  vehicleType!: VehicleType;

  @IsEnum(Size)
  @IsNotEmpty()
  size!: Size;

  @IsEnum(Location)
  @IsNotEmpty()
  location!: Location;
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

export class UpdateSlotDto {
  @IsString()
  @IsOptional()
  slotNumber?: string;

  @IsEnum(VehicleType)
  @IsOptional()
  vehicleType?: VehicleType;

  @IsEnum(Size)
  @IsOptional()
  size?: Size;

  @IsEnum(Location)
  @IsOptional()
  location?: Location;

  @IsEnum(SlotStatus)
  @IsOptional()
  status?: SlotStatus;
}

export class GetSlotsQueryDto {
  @IsString()
  @IsOptional()
  page?: string = '1';

  @IsString()
  @IsOptional()
  limit?: string = '10';

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(SlotStatus)
  @IsOptional()
  status?: SlotStatus;
}

export class SlotRequestDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  vehicleId!: string;

  @IsEnum(Location)
  @IsOptional()
  preferredLocation?: Location;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.startTime !== undefined && o.startTime !== '')
  startTime?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.endTime !== undefined && o.endTime !== '')
  endTime?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateSlotRequestDto {
  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @IsEnum(Location)
  @IsOptional()
  preferredLocation?: Location;

  @IsDateString()
  @IsOptional()
  @ValidateDateRange()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  @ValidateDateRange()
  endDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ApproveSlotRequestDto {
  @IsUUID()
  @IsNotEmpty()
  slotId!: string;
}

export class RejectSlotRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Rejection reason is required' })
  rejectionReason!: string;
}

