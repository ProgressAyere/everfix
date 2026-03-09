require('dotenv').config();
const app = require('./app');
const { deleteExpiredAccounts } = require('./jobs/deleteExpiredAccounts');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: ${process.env.API_URL || `http://localhost:${PORT}`}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  
  // Run expired accounts deletion job daily at midnight
  setInterval(deleteExpiredAccounts, 24 * 60 * 60 * 1000);
  console.log('⏰ Scheduled daily job: Delete expired accounts');
});
