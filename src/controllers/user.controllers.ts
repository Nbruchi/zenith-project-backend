import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma, {logAction} from '../prisma/prisma-client';
import ServerResponse from '../utils/ServerResponse';
import { UpdateProfileDto, UpdatePasswordDto } from '../dtos/auth.dto';
import { Prisma } from '@prisma/client';

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserController {
  static async updateProfile(req: Request, res: Response) {
    const { name, email } = req.body as UpdateProfileDto;
    const userId = (req as any).user.id;
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { name, email },
      });
      await logAction(userId, 'Profile updated');
      return ServerResponse.success(res, { id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
      return ServerResponse.badRequest(res, 'Email already exists');
    }
  }

  static async updatePassword(req: Request, res: Response) {
    const { currentPassword, newPassword } = req.body as UpdatePasswordDto;
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return ServerResponse.unauthorized(res, 'Invalid current password');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    await logAction(userId, 'Password updated');
    return ServerResponse.success(res, null, 'Password updated successfully');
  }

  static async getUsers(req: Request, res: Response) {
    try {
      if (!(req as any).user || (req as any).user.role !== 'ADMIN') {
        return ServerResponse.forbidden(res, 'Forbidden');
      }

      const { page = '1', limit = '10', search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
        return ServerResponse.badRequest(res, 'Invalid page or limit');
      }

      const where: Prisma.UserWhereInput = {
        role: { not: 'ADMIN' }
      };

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: {
              select: {
                vehicles: true,
                slotRequests: true
              }
            }
          },
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
      ]);

      const response: PaginatedResponse<any> = {
        items: users.map(user => ({
          ...user,
          vehicleCount: user._count.vehicles,
          requestCount: user._count.slotRequests
        })),
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      };

      return ServerResponse.success(res, response);
    } catch (error: any) {
      return ServerResponse.error(res, error.message || 'Internal Server Error');
    }
  }
}