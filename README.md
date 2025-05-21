# 🚗 Vehicle Parking Management System - Backend

## 📝 Overview

A robust Node.js backend service for managing vehicle parking operations. Built with Express.js, TypeScript, and PostgreSQL, this system provides secure and efficient parking management capabilities.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Email Service:** Nodemailer
- **Testing:** Jest

## 🏗 Project Structure

backend/
├── prisma/ # Database schema and migrations
├── src/
│ ├── controllers/ # Request handlers
│ ├── middleware/ # Custom middleware
│ ├── routes/ # API routes
│ ├── services/ # Business logic
│ ├── utils/ # Helper functions
│ └── app.ts # Application entry point
└── tests/ # Test files

## 🚀 Features

### 👥 User Management

- User registration and authentication
- Role-based access control (Admin/User)
- Profile management
- JWT-based secure authentication

### 🚘 Vehicle Management

- Vehicle registration with details
- Multiple vehicle support per user
- Vehicle type and size classification
- Flexible attribute storage using JSONB

### 🅿️ Parking Slot Management

- Bulk slot creation for admins
- Slot status tracking
- Location-based slot organization
- Size and vehicle type compatibility

### 📋 Slot Request System

- Request creation and management
- Automatic slot assignment
- Request approval/rejection workflow
- Email notifications for status updates

### 🔍 Search & Pagination

- Advanced search capabilities
- Paginated API responses
- Filtering and sorting options
- Metadata for pagination

### 📊 Action Logging

- Comprehensive audit logging
- User action tracking
- System event logging
- Security audit trail

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Configure your environment variables
```

4. Set up the database

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/vehicles` - List user vehicles

### Vehicle Endpoints

- `POST /api/vehicles` - Add new vehicle
- `GET /api/vehicles` - List vehicles
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Parking Slot Endpoints

- `POST /api/slots/bulk` - Create multiple slots
- `GET /api/slots` - List parking slots
- `PUT /api/slots/:id` - Update slot
- `DELETE /api/slots/:id` - Delete slot

### Request Endpoints

- `POST /api/requests` - Create slot request
- `GET /api/requests` - List requests
- `PUT /api/requests/:id` - Update request
- `POST /api/requests/:id/approve` - Approve request
- `POST /api/requests/:id/reject` - Reject request

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting
- Input validation
- CORS protection
