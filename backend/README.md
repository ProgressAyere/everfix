# Phone Repair Platform - Backend API

## Overview
This is the backend API for the Phone Repair Platform, handling user authentication, verification (including live face recognition), order management, payment processing, and real-time tracking.

## Technology Stack

### Core Framework
- **Node.js** (v18+) with **Express.js** - REST API server
- **TypeScript** - Type safety and better developer experience

### Database
- **PostgreSQL** - Primary relational database for structured data
- **Redis** - Caching and session management
- **MongoDB** (Optional) - For logs and analytics

### Authentication & Security
- **JWT (JSON Web Tokens)** - Stateless authentication
- **bcrypt** - Password hashing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **cors** - Cross-origin resource sharing

### Face Verification & AI
- **AWS Rekognition** OR **Azure Face API** - Live face verification and matching
- **Multer** - File upload handling
- **Sharp** - Image processing and optimization

### Payment Integration
- **Paystack** OR **Flutterwave** - Nigerian payment gateway
- **Stripe** (Optional) - International payments

### Real-time Features
- **Socket.io** - Real-time order tracking and notifications
- **Bull** - Job queue for background tasks

### External Services
- **Twilio** OR **Termii** - SMS/OTP verification
- **SendGrid** OR **AWS SES** - Email notifications
- **Google Maps API** - Location and routing
- **Cloudinary** OR **AWS S3** - File storage

### Development Tools
- **Prisma** OR **TypeORM** - Database ORM
- **Jest** - Testing framework
- **ESLint** & **Prettier** - Code quality
- **Winston** - Logging
- **dotenv** - Environment variables

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── aws.ts
│   │   └── payment.ts
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── verification.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts
│   │   └── rating.controller.ts
│   ├── middleware/       # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── upload.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/          # Database models
│   │   ├── User.model.ts
│   │   ├── Order.model.ts
│   │   ├── Verification.model.ts
│   │   ├── Payment.model.ts
│   │   └── Rating.model.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── verification.routes.ts
│   │   ├── order.routes.ts
│   │   ├── payment.routes.ts
│   │   └── rating.routes.ts
│   ├── services/        # Business logic
│   │   ├── auth.service.ts
│   │   ├── face-verification.service.ts
│   │   ├── nin-verification.service.ts
│   │   ├── sms.service.ts
│   │   ├── email.service.ts
│   │   ├── payment.service.ts
│   │   └── notification.service.ts
│   ├── utils/           # Helper functions
│   │   ├── jwt.util.ts
│   │   ├── validation.util.ts
│   │   ├── image.util.ts
│   │   └── logger.util.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── prisma/              # Database schema
│   ├── schema.prisma
│   └── migrations/
├── tests/               # Test files
│   ├── unit/
│   └── integration/
├── uploads/             # Temporary file uploads
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- password_hash (String)
- role (Enum: customer, engineer, rider, admin)
- full_name (String)
- phone_number (String, Unique)
- is_verified (Boolean)
- verification_status (Enum: unverified, partial, verified)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Verification Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- identity_document_url (String)
- selfie_url (String)
- nin_number (String, Encrypted)
- nin_verified (Boolean)
- face_match_confidence (Float)
- phone_verified (Boolean)
- email_verified (Boolean)
- address_verified (Boolean)
- verification_date (Timestamp)
- status (Enum: pending, approved, rejected)
```

### Orders Table
```sql
- id (UUID, Primary Key)
- order_number (String, Unique)
- customer_id (UUID, Foreign Key)
- engineer_id (UUID, Foreign Key, Nullable)
- rider_id (UUID, Foreign Key, Nullable)
- device_type (Enum: phone, laptop)
- brand (String)
- model (String)
- problem (String)
- color (String)
- pickup_date (Date)
- pickup_address (JSON)
- status (Enum: pending, assigned, in_progress, completed, cancelled)
- estimated_cost (Decimal)
- final_cost (Decimal)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Payments Table
```sql
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key)
- user_id (UUID, Foreign Key)
- amount (Decimal)
- payment_method (Enum: card, wallet, transfer)
- payment_reference (String, Unique)
- status (Enum: pending, successful, failed, refunded)
- gateway_response (JSON)
- created_at (Timestamp)
```

### Ratings Table
```sql
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key)
- rater_id (UUID, Foreign Key)
- ratee_id (UUID, Foreign Key)
- rating (Integer, 1-5)
- feedback (Text)
- reply (Text, Nullable)
- created_at (Timestamp)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Verification
- `POST /api/verification/upload-documents` - Upload ID and selfie
- `POST /api/verification/verify-nin` - Verify NIN number
- `POST /api/verification/live-face-capture` - Capture live face for verification
- `POST /api/verification/send-phone-otp` - Send phone OTP
- `POST /api/verification/verify-phone-otp` - Verify phone OTP
- `GET /api/verification/status/:userId` - Get verification status

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (filtered by user role)
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### Payments
- `POST /api/payments/initialize` - Initialize payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/refund` - Request refund

### Ratings
- `POST /api/ratings` - Submit rating
- `GET /api/ratings/user/:userId` - Get user ratings
- `POST /api/ratings/:id/reply` - Reply to rating

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `GET /api/users/engineers` - Get available engineers
- `GET /api/users/riders` - Get available riders

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/phonefix
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# AWS (for Rekognition & S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=phonefix-uploads
AWS_REKOGNITION_COLLECTION_ID=phonefix-faces

# Payment Gateway (Paystack)
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx

# SMS Service (Termii)
TERMII_API_KEY=your-termii-api-key
TERMII_SENDER_ID=PhoneFix

# Email Service (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@phonefix.com

# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-key

# NIN Verification API (if available)
NIN_VERIFICATION_API_KEY=your-nin-api-key
NIN_VERIFICATION_URL=https://api.nin-verification.com
```

## Installation & Setup

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- Redis 6+
- AWS Account (for Rekognition & S3)

### Steps

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Setup Database**
```bash
# Create PostgreSQL database
createdb phonefix

# Run migrations
npx prisma migrate dev
```

3. **Setup Redis**
```bash
# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Start Redis
redis-server
```

4. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

5. **Run Development Server**
```bash
npm run dev
```

6. **Run Tests**
```bash
npm test
```

## Face Verification Flow

### 1. Document Upload (Step 1)
- User uploads ID card/passport photo
- User takes selfie
- Images stored in S3/Cloudinary
- Basic validation (file size, format)

### 2. NIN Verification (Step 2)
- User enters NIN number
- API call to NIN verification service
- Match name and DOB with uploaded ID

### 3. Live Face Capture (Step 3)
- User opens camera in browser
- Capture live photo via WebRTC
- Send to backend for processing

### 4. Face Matching (Backend)
- Extract face from ID document using AWS Rekognition
- Extract face from selfie
- Extract face from live capture
- Compare all three faces
- Calculate confidence score (must be >90%)
- Store face in Rekognition collection for future verification

### 5. Verification Decision
- If all checks pass → Status: Verified
- If some checks pass → Status: Partially Verified
- If checks fail → Status: Unverified (allow retry)

## Security Best Practices

1. **Password Security**
   - Hash passwords with bcrypt (10+ rounds)
   - Enforce strong password policy
   - Implement password reset with time-limited tokens

2. **JWT Security**
   - Use short-lived access tokens (15-30 min)
   - Use long-lived refresh tokens (7-30 days)
   - Store refresh tokens in httpOnly cookies
   - Implement token rotation

3. **API Security**
   - Rate limiting (100 requests/15 min per IP)
   - Input validation and sanitization
   - SQL injection prevention (use ORM)
   - XSS protection
   - CSRF protection

4. **File Upload Security**
   - Validate file types (only images)
   - Limit file size (max 5MB)
   - Scan for malware
   - Store in secure cloud storage

5. **Data Protection**
   - Encrypt sensitive data (NIN, payment info)
   - Use HTTPS in production
   - Implement GDPR compliance
   - Regular security audits

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Development Checklist

See [CHECKLIST.md](./CHECKLIST.md) for implementation checklist.

## Contributing

1. Create feature branch
2. Write tests
3. Ensure all tests pass
4. Submit pull request

## License

Proprietary - All rights reserved
