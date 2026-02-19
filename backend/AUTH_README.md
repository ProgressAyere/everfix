# Authentication System - Setup Complete ✅

## Overview
Professional authentication system with Zod validation, bcrypt password hashing, JWT tokens, and comprehensive security features.

## Features Implemented

### ✅ Sign Up
- Email validation (lowercase, trimmed, valid format)
- Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
- Name validation (letters, spaces, hyphens, apostrophes only)
- Role validation (customer, engineer, rider, admin)
- Password hashing with bcrypt (12 rounds)
- JWT access token (7 days)
- JWT refresh token (30 days, httpOnly cookie)
- Duplicate email prevention

### ✅ Sign In
- Email and password validation
- Account lockout after 5 failed attempts (15 minutes)
- Password comparison with bcrypt
- Login attempt tracking
- JWT token generation
- Refresh token in httpOnly cookie
- Secure cookie settings (httpOnly, sameSite, secure in production)

### ✅ Sign Out
- Single device logout
- Refresh token deletion
- Cookie clearing
- Graceful error handling

### ✅ Additional Features
- Refresh access token endpoint
- Sign out from all devices
- Role-based authorization middleware
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- Request validation with Zod

## Installation

```bash
cd backend
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Public Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "role": "customer"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "customer",
      "isVerified": false,
      "verificationStatus": "unverified",
      "createdAt": "2024-01-20T10:00:00.000Z"
    },
    "accessToken": "jwt-token"
  }
}
```

#### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "customer"
    },
    "accessToken": "jwt-token"
  }
}
```

#### Sign Out
```http
POST /api/auth/signout
Cookie: refreshToken=jwt-refresh-token
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refreshToken=jwt-refresh-token
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

### Protected Endpoints

#### Sign Out All Devices
```http
POST /api/auth/signout-all
Authorization: Bearer jwt-access-token
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out from all devices successfully"
}
```

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Maximum 128 characters

### Account Lockout
- 5 failed login attempts
- 15-minute lockout period
- Automatic unlock after timeout

### Token Security
- Access tokens expire in 7 days
- Refresh tokens expire in 30 days
- Refresh tokens stored in httpOnly cookies
- Secure flag enabled in production
- SameSite strict policy

### Rate Limiting
- 100 requests per 15 minutes per IP
- Applied to all `/api/*` routes

### Additional Security
- Helmet.js security headers
- CORS with credentials
- Bcrypt password hashing (12 rounds)
- Input validation with Zod
- SQL injection prevention (no SQL yet, but prepared)

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Account Locked (423)
```json
{
  "success": false,
  "message": "Account temporarily locked due to multiple failed login attempts. Please try again later."
}
```

### User Exists (409)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

## Testing with Frontend

Update your Next.js frontend to use the API:

```javascript
// Sign Up
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    fullName: 'John Doe',
    role: 'customer'
  })
});

const data = await response.json();
// Store accessToken in localStorage or state
localStorage.setItem('accessToken', data.data.accessToken);

// Sign In
const response = await fetch('http://localhost:5000/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  })
});

// Protected Request
const response = await fetch('http://localhost:5000/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  },
  credentials: 'include'
});
```

## Next Steps

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Add UUID Package:**
   ```bash
   npm install uuid
   ```

3. **Start Server:**
   ```bash
   npm run dev
   ```

4. **Test Endpoints:**
   - Use Postman or Thunder Client
   - Test sign up, sign in, sign out
   - Verify token refresh works
   - Test account lockout (5 failed attempts)

5. **Integrate with Frontend:**
   - Update login page to call API
   - Store access token
   - Add Authorization header to requests
   - Handle token refresh

6. **Database Integration (Next):**
   - Replace in-memory storage with PostgreSQL
   - Add Prisma ORM
   - Create database migrations
   - Update storage.util.js

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── auth.controller.js      # Sign up, sign in, sign out logic
│   ├── middleware/
│   │   └── auth.middleware.js      # JWT verification, role authorization
│   ├── routes/
│   │   └── auth.routes.js          # Auth endpoints
│   ├── utils/
│   │   ├── jwt.util.js             # Token generation/verification
│   │   ├── password.util.js        # Password hashing/comparison
│   │   └── storage.util.js         # In-memory user storage
│   ├── validators/
│   │   └── auth.validator.js       # Zod schemas
│   ├── app.js                      # Express app configuration
│   └── server.js                   # Server entry point
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Notes

- Currently using in-memory storage (Map)
- Replace with database before production
- Refresh tokens stored in httpOnly cookies for security
- Access tokens sent in response body (store in memory/state, not localStorage for better security)
- All passwords hashed with bcrypt (12 rounds)
- Account lockout prevents brute force attacks
- Rate limiting prevents DDoS attacks

## Support

For issues or questions, refer to the main project documentation.
