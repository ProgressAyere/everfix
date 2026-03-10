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
const supabase = require('../config/supabase');

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

    // Create user in Supabase Auth first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: role
      }
    });

    if (authError) {
      console.error('Supabase auth creation error:', authError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user account'
      });
    }

    // Hash password for local storage
    const hashedPassword = await hashPassword(password);

    // Generate unique user ID
    const userNumber = await getNextUserNumber(role);
    const userId = generateUserId(role, userNumber);

    // Create user in local database
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

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    console.log('Forgot password request for:', email);

    // Check if user exists in our database
    const user = await findUserByEmail(email);
    if (!user) {
      console.log('User not found in database:', email);
      // Return success even if user doesn't exist (security best practice)
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions'
      });
    }

    console.log('User found, attempting to send reset email via Supabase...');

    // Send password reset email using Supabase Auth
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`
    });

    if (error) {
      console.error('Supabase reset password error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email: ' + error.message
      });
    }

    console.log('Reset email sent successfully via Supabase');
    console.log('Response data:', data);

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;

    if (!password || !token) {
      return res.status(400).json({
        success: false,
        message: 'Password and token are required'
      });
    }

    // Verify token and update password using Supabase
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Supabase update password error:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash the new password and update in our database
    const hashedPassword = await hashPassword(password);
    const user = await findUserByEmail(data.user.email);
    
    if (user) {
      await supabase
        .from('users')
        .update({ password: hashedPassword, updated_at: new Date() })
        .eq('email', data.user.email);
      
      // Clear all failed login attempts after successful password reset
      await supabase
        .from('login_attempts')
        .delete()
        .eq('email', data.user.email.toLowerCase());
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete User (Admin)
const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Delete from Supabase Auth
    const { data: userData } = await supabase.auth.admin.listUsers();
    const authUser = userData.users.find(u => u.email === email);
    
    if (authUser) {
      await supabase.auth.admin.deleteUser(authUser.id);
    }

    // Delete from local database
    await supabase.from('users').delete().eq('email', email);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Deactivate Account (Customer)
const deactivateAccount = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 30);

    await supabase
      .from('users')
      .update({
        is_deactivated: true,
        deactivation_date: new Date().toISOString(),
        scheduled_deletion_date: deletionDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    res.status(200).json({
      success: true,
      message: 'Account deactivated. You have 30 days to reactivate.'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await comparePassword(password, data.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Credentials verified'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin Security Verification
const adminVerifySecurity = async (req, res) => {
  try {
    const { email, securityAnswers } = req.body;

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({
        success: false,
        message: 'Invalid request'
      });
    }

    const answers = [
      data.security_answer_1?.toLowerCase().trim(),
      data.security_answer_2?.toLowerCase().trim(),
      data.security_answer_3?.toLowerCase().trim()
    ];

    const providedAnswers = securityAnswers.map(a => a.toLowerCase().trim());

    if (answers[0] !== providedAnswers[0] || 
        answers[1] !== providedAnswers[1] || 
        answers[2] !== providedAnswers[2]) {
      return res.status(401).json({
        success: false,
        message: 'Security verification failed'
      });
    }

    const token = generateAccessToken(data.id, data.email, 'admin');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: data.id,
        email: data.email,
        name: data.name
      }
    });
  } catch (error) {
    console.error('Admin security verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Unlock Account
const unlockAccount = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    await supabase
      .from('login_attempts')
      .delete()
      .eq('email', email.toLowerCase());

    res.status(200).json({
      success: true,
      message: 'Account unlocked successfully'
    });
  } catch (error) {
    console.error('Unlock account error:', error);
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
  signOutAll,
  forgotPassword,
  resetPassword,
  deleteUser,
  deactivateAccount,
  adminLogin,
  adminVerifySecurity,
  unlockAccount
};
