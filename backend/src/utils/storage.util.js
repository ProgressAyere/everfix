const supabase = require('../config/supabase');

const getNextUserNumber = async (role) => {
  const prefix = role === 'customer' ? 'CUST' : role === 'engineer' ? 'ENG' : 'RDR';
  const year = new Date().getFullYear();
  const pattern = `${prefix}-${year}-%`;
  
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .ilike('id', pattern)
    .order('id', { ascending: false })
    .limit(1);
  
  if (error) throw error;
  
  if (!data || data.length === 0) return 1;
  
  const lastId = data[0].id;
  const lastNumber = parseInt(lastId.split('-')[2]);
  return lastNumber + 1;
};

// User operations
const createUser = async (user) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      id: user.id,
      email: user.email.toLowerCase(),
      password: user.password,
      full_name: user.fullName,
      role: user.role,
      is_verified: user.isVerified,
      verification_status: user.verificationStatus
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

const findUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Refresh token operations
const saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const { error } = await supabase
    .from('refresh_tokens')
    .insert([{ user_id: userId, token, expires_at: expiresAt.toISOString() }]);
  
  if (error) throw error;
};

const findRefreshToken = async (userId, token) => {
  const { data, error } = await supabase
    .from('refresh_tokens')
    .select('*')
    .eq('user_id', userId)
    .eq('token', token)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

const deleteRefreshToken = async (userId, token) => {
  const { error } = await supabase
    .from('refresh_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('token', token);
  
  if (error) throw error;
};

const deleteAllRefreshTokens = async (userId) => {
  const { error } = await supabase
    .from('refresh_tokens')
    .delete()
    .eq('user_id', userId);
  
  if (error) throw error;
};

// Login attempt tracking
const getLoginAttempts = async (email) => {
  const { data, error } = await supabase
    .from('login_attempts')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();
  
  if (error && error.code !== 'PGRST116') return null;
  return data;
};

const incrementLoginAttempts = async (email, userId = null, ipAddress = null) => {
  const { error } = await supabase
    .from('login_attempts')
    .insert([{ email: email.toLowerCase(), user_id: userId, ip_address: ipAddress, successful: false }]);
  
  if (error) throw error;
};

const resetLoginAttempts = async (email, userId = null, ipAddress = null) => {
  // Delete failed attempts
  await supabase
    .from('login_attempts')
    .delete()
    .eq('email', email.toLowerCase())
    .eq('successful', false);
  
  // Insert successful login record
  const { error } = await supabase
    .from('login_attempts')
    .insert([{ email: email.toLowerCase(), user_id: userId, ip_address: ipAddress, successful: true }]);
  
  if (error) throw error;
};

const isAccountLocked = async (email) => {
  const { data: attempts, error } = await supabase
    .from('login_attempts')
    .select('*')
    .eq('email', email.toLowerCase())
    .eq('successful', false)
    .order('attempted_at', { ascending: false })
    .limit(5);
  
  if (error) throw error;
  
  const recentFailedAttempts = attempts?.filter(a => 
    new Date(a.attempted_at) > new Date(Date.now() - 900000)
  ).length || 0;
  
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
  return recentFailedAttempts >= maxAttempts;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllRefreshTokens,
  getLoginAttempts,
  incrementLoginAttempts,
  resetLoginAttempts,
  isAccountLocked,
  getNextUserNumber
};
