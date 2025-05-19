import { config } from 'dotenv';
import nodemailer, { Transporter } from 'nodemailer';
import { logAction } from 'prisma/prisma-client';
import { PARKING_RATE_PER_30MIN } from '../dtos/parking.dto';

config();

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL/TLS for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration on startup
transporter.verify((error: Error | null, success: boolean) => {
  if (error) {
    console.error('Nodemailer verification failed:', error.message);
    throw new Error('Failed to initialize email transporter');
  }
  console.log('Nodemailer is ready to send emails');
});

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('Missing EMAIL_USER or EMAIL_PASS in environment variables');
}
if (!process.env.CLIENT_URL) {
  throw new Error('Missing CLIENT_URL in environment variables');
}

const sendAccountVerificationEmail = async (email: string, names: string, verificationToken: string) => {
  try {
    await transporter.sendMail({
      from: `"NE NodeJS Template" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Account Verification',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h2 { color: #4200FE; }
            a { color: #4200FE; text-decoration: none; }
            .code { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Dear ${names},</h2>
            <p>Please verify your account by clicking the link below or using the verification code:</p>
            <p class="code">Verification Code: ${verificationToken}</p>
            <p><a href="${process.env.CLIENT_URL}/auth/verify-email/${verificationToken}">Click here to verify</a></p>
            <p>This code expires in 6 hours.</p>
            <p>Best regards,<br>NE NodeJS Template Team</p>
          </div>
        </body>
        </html>
      `,
    });

    await logAction('system', `Sent account verification email to ${email}`);
    return { message: 'Email sent successfully', status: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logAction('system', `Failed to send account verification email to ${email}: ${errorMessage}`);
    return { message: 'Unable to send email', status: false };
  }
};

const sendPasswordResetEmail = async (email: string, names: string, passwordResetToken: string) => {
  try {
    await transporter.sendMail({
      from: `"NE NodeJS Template" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h2 { color: #4200FE; }
            a { color: #4200FE; text-decoration: none; }
            .code { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Dear ${names},</h2>
            <p>Click the link below or use the code to reset your password:</p>
            <p class="code">Reset Code: ${passwordResetToken}</p>
            <p><a href="${process.env.CLIENT_URL}/auth/reset-password/${passwordResetToken}">Click here to reset password</a></p>
            <p>This code expires in 6 hours.</p>
            <p>Best regards,<br>NE NodeJS Template Team</p>
          </div>
        </body>
        </html>
      `,
    });

    await logAction('system', `Sent password reset email to ${email}`);
    return { message: 'Email sent successfully', status: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logAction('system', `Failed to send password reset email to ${email}: ${errorMessage}`);
    return { message: 'Unable to send email', status: false };
  }
};

// Add this function to calculate parking duration and cost
function calculateParkingCost(startTime: Date, endTime: Date): { duration: string; cost: number } {
  const diffInMinutes = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  const halfHourBlocks = Math.ceil(diffInMinutes / 30);
  const cost = halfHourBlocks * PARKING_RATE_PER_30MIN;
  
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  const duration = `${hours}h ${minutes}m`;
  
  return { duration, cost };
}

export const sendSlotApprovalEmail = async (
  email: string,
  slotNumber: string,
  plateNumber: string,
  startTime: Date,
  endTime: Date
) => {
  const { duration, cost } = calculateParkingCost(startTime, endTime);
  
  try {
    await transporter.sendMail({
      from: `"Parking System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Parking Slot Request Approved',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h2 { color: #4200FE; }
            .details { margin: 20px 0; }
            .amount { font-size: 1.2em; font-weight: bold; color: #4200FE; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Parking Slot Request Approved</h2>
            <div class="details">
              <p>Your parking request has been approved with the following details:</p>
              <ul>
                <li>Slot Number: ${slotNumber}</li>
                <li>Vehicle Plate: ${plateNumber}</li>
                <li>Start Time: ${startTime.toLocaleTimeString()}</li>
                <li>End Time: ${endTime.toLocaleTimeString()}</li>
                <li>Duration: ${duration}</li>
                <li class="amount">Amount to Pay: ${cost} RWF</li>
              </ul>
            </div>
            <p>Please ensure to pay the parking fee at the reception desk.</p>
            <p>Best regards,<br>Parking System Team</p>
          </div>
        </body>
        </html>
      `,
    });

    await logAction('system', `Sent slot approval email to ${email}`);
    return { message: 'Email sent successfully', status: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logAction('system', `Failed to send slot approval email to ${email}: ${errorMessage}`);
    return { message: 'Unable to send email', status: false };
  }
};

export { sendAccountVerificationEmail, sendPasswordResetEmail };