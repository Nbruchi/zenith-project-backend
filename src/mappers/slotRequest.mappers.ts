import { SlotRequest as PrismaSlotRequest, User, Vehicle, ParkingSlot } from '@prisma/client';

export interface FrontendSlotRequest {
  id: string;
  userId: string;
  userName: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleType: string;
  preferredLocation?: string;
  startTime?: string;
  endTime?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  assignedSlot?: {
    id: string;
    slotNumber: string;
  };
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export function toFrontendSlotRequest(
  slotRequest: PrismaSlotRequest & {
    User?: Partial<User> | null;
    vehicle?: Partial<Vehicle> | null;
    slot?: Partial<ParkingSlot> | null;
  }
): FrontendSlotRequest {
  return {
    id: slotRequest.id,
    userId: slotRequest.userId,
    userName: slotRequest.User?.name ?? 'Unknown',
    vehicleId: slotRequest.vehicleId,
    vehiclePlate: slotRequest.vehicle?.plateNumber ?? 'N/A',
    vehicleType: slotRequest.vehicle?.vehicleType ?? 'N/A',
    preferredLocation: slotRequest.preferredLocation ?? undefined,
    startTime: slotRequest.startTime?.toISOString(),
    endTime: slotRequest.endTime?.toISOString(),
    status: slotRequest.status.toLowerCase() as 'pending' | 'approved' | 'rejected',
    notes: slotRequest.notes ?? undefined,
    assignedSlot: slotRequest.slot?.id && slotRequest.slot?.slotNumber
      ? { id: slotRequest.slot.id, slotNumber: slotRequest.slot.slotNumber }
      : undefined,
    rejectionReason: slotRequest.rejectionReason ?? undefined,
    createdAt: slotRequest.createdAt.toISOString(),
    updatedAt: slotRequest.updatedAt.toISOString(),
  };
}
