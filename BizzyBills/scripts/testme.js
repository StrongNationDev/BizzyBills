import { supabase } from './user.js';

window.addEventListener('DOMContentLoaded', async () => {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    console.error("❌ Not logged in or failed to get auth user", authError);
    alert("You are not logged in.");
    return;
  }

  const authUser = authData.user;
  console.log("✅ Logged in user from auth:", authUser);

  const userId = authUser.id;

  // Now fetch the full row from 'users' table
  const { data: userRow, error: userFetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userFetchError) {
    console.error("❌ Error fetching user from 'users' table:", userFetchError);
    alert("Could not fetch user profile from database.");
    return;
  }

  console.log("✅ Full user record from 'users' table:", userRow);
});
