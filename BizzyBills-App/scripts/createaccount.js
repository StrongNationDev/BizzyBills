// createaccount.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://xhuyzhlutarpffhdwbni.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM'
);

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const full_name = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const location = document.getElementById('location').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const pin = document.getElementById('pin').value.trim();
  const password = document.getElementById('password').value;

  if (!/^\d{4}$/.test(pin)) {
    alert("PIN must be 4 digits.");
    return;
  }

  // Step 1: Check for existing user
  const { data: existingUsers, error: existingError } = await supabase
    .from('users')
    .select('id')
    .or(`username.eq.${username},phone.eq.${phone}`);

  if (existingError || existingUsers.length > 0) {
    alert(existingError ? 'Error checking user' : 'Username or Phone already exists');
    return;
  }

  // Step 2: Sign up in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError || !authData?.user?.id) {
    alert('Signup failed: ' + (authError?.message || 'No user ID returned'));
    return;
  }

  const userId = authData.user.id;

  // Step 3: Insert user data into Supabase DB
  const { error: dbError } = await supabase.from('users').insert([{
    id: userId,
    full_name,
    pin,
    email,
    password,
    phone,
    location,
    username,
    wallet_balance: 0,
    account_number: '',
    account_type: 'regular',
    history: [],
    notifications: []
  }]);

  if (dbError) {
    alert('Signup failed at DB level: ' + dbError.message);
    return;
  }

  alert('Your BizzyBills NG Account Registration is Successful! Go ahead and Login now.');
});
