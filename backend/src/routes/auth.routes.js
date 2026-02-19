const express = require('express');
const router = express.Router();
const {
  signUp,
  signIn,
  signOut,
  refreshAccessToken,
  signOutAll
} = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/refresh', refreshAccessToken);

// Protected routes
router.post('/signout-all', authenticate, signOutAll);

module.exports = router;
