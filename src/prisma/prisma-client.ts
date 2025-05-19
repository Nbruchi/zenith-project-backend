import { PrismaClient } from '@prisma/client';

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export const logAction = async (userId: string | null, action: string) => {
  try {
    // If userId is 'system', don't include it in the log
    const logData = userId === 'system' 
      ? { action, createdAt: new Date() }
      : { userId, action, createdAt: new Date() };

    await prisma.log.create({
      data: logData,
    });
  } catch (error) {
    // Log the error but don't throw it to prevent breaking the main flow
    console.error('Failed to log action:', error);
  }
};

export default prisma; 