const supabase = require('../config/supabase');

const deleteExpiredAccounts = async () => {
  try {
    console.log('Running expired accounts deletion job...');
    
    const now = new Date().toISOString();
    
    // Find accounts scheduled for deletion
    const { data: expiredUsers, error: fetchError } = await supabase
      .from('users')
      .select('email')
      .eq('is_deactivated', true)
      .lte('scheduled_deletion_date', now);
    
    if (fetchError) {
      console.error('Error fetching expired accounts:', fetchError);
      return;
    }
    
    if (!expiredUsers || expiredUsers.length === 0) {
      console.log('No expired accounts to delete');
      return;
    }
    
    console.log(`Found ${expiredUsers.length} expired accounts to delete`);
    
    // Delete each user from both Supabase Auth and database
    for (const user of expiredUsers) {
      try {
        // Delete from Supabase Auth
        const { data: userData } = await supabase.auth.admin.listUsers();
        const authUser = userData.users.find(u => u.email === user.email);
        
        if (authUser) {
          await supabase.auth.admin.deleteUser(authUser.id);
          console.log(`Deleted from Supabase Auth: ${user.email}`);
        }
        
        // Delete from database
        await supabase.from('users').delete().eq('email', user.email);
        console.log(`Deleted from database: ${user.email}`);
        
      } catch (error) {
        console.error(`Error deleting user ${user.email}:`, error);
      }
    }
    
    console.log('Expired accounts deletion job completed');
  } catch (error) {
    console.error('Error in deleteExpiredAccounts job:', error);
  }
};

module.exports = { deleteExpiredAccounts };
