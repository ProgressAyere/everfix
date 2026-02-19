const { v4: uuidv4 } = require('uuid');
const { signUpSchema, signInSchema, refreshTokenSchema } = require('../validators/auth.validator');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.util');
const {
  createUser,
  findUserByEmail,
  findUserById,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllRefreshTokens,
  incrementLoginAttempts,
  resetLoginAttempts,
  isAccountLocked,
  getNextUserNumber
} = require('../utils/storage.util');

const generateUserId = (role, number) => {
  const prefix = role === 'customer' ? 'CUST' : role === 'engineer' ? 'ENG' : 'RDR';
  const year = new Date().getFullYear();
  const paddedNumber = String(number).padStart(4, '0');
  return `${prefix}-${year}-${paddedNumber}`;
};

// Sign Up
const signUp = async (req, res) => {
  try {
    // Validate request body
    const validatedData = signUpSchema.parse(req.body);
    const { email, password, fullName, role } = validatedData;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate unique user ID
    const userNumber = await getNextUserNumber(role);
    const userId = generateUserId(role, userNumber);

    // Create user
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      fullName,
      role,
      isVerified: false,
      verificationStatus: 'unverified',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await createUser(user);

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token
    await saveRefreshToken(user.id, refreshToken);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        accessToken
      }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    console.error('Sign up error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Sign In
const signIn = async (req, res) => {
  try {
    // Validate request body
    const validatedData = signInSchema.parse(req.body);
    const { email, password } = validatedData;

    // Check if account is locked
    if (await isAccountLocked(email)) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      await incrementLoginAttempts(email, null, req.ip);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      await incrementLoginAttempts(email, user.id, req.ip);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    await resetLoginAttempts(email, user.id, req.ip);

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token
    await saveRefreshToken(user.id, refreshToken);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Return user data (without password)
    const userResponse = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      isVerified: user.is_verified,
      verificationStatus: user.verification_status,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        accessToken
      }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Sign Out
const signOut = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Verify and decode token
      const decoded = verifyRefreshToken(refreshToken);
      
      // Delete refresh token from storage
      await deleteRefreshToken(decoded.userId, refreshToken);
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    // Even if token verification fails, clear the cookie
    res.clearCookie('refreshToken');
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
};

// Refresh Access Token
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in storage
    const storedToken = await findRefreshToken(decoded.userId, refreshToken);
    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Find user
    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user.id, user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
};

// Sign Out All Devices
const signOutAll = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete all refresh tokens for this user
    await deleteAllRefreshTokens(userId);

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Sign out all error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  refreshAccessToken,
  signOutAll
};
