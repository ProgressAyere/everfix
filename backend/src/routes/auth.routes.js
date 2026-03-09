const express = require('express');
const router = express.Router();
const {
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
  adminVerifySecurity
} = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/deactivate-account', deactivateAccount);

// Admin routes
router.post('/admin/login', adminLogin);
router.post('/admin/verify-security', adminVerifySecurity);
router.delete('/admin/delete-user/:email', deleteUser);

// Protected routes
router.post('/signout-all', authenticate, signOutAll);

module.exports = router;
