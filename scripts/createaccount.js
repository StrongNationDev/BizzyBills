import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://xhuyzhlutarpffhdwbni.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Keep your full key here
const supabase = createClient(supabaseUrl, supabaseKey);

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

  // 1. Check if username or phone already exists
  const { data: existingUsers, error: existingError } = await supabase
    .from('users')
    .select('id')
    .or(`username.eq.${username},phone.eq.${phone}`);

  if (existingError) {
    console.error("User check failed:", existingError.message);
    alert('Something went wrong while checking existing users.');
    return;
  }

  if (existingUsers.length > 0) {
    alert('Username or Phone number already exists. Please use a different one.');
    return;
  }

  // 2. Sign up with magic link
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://www.bizzybillsng.store/verified.html'
    }
  });

  if (authError) {
    console.error("Auth sign-up error:", authError.message);
    alert('Signup failed: ' + authError.message);
    return;
  }

  const userId = authData?.user?.id;
  if (!userId) {
    alert('Signup failed: No user ID returned.');
    return;
  }

  // 3. Store user data in Supabase database
  const { error: dbError } = await supabase
    .from('users')
    .insert([{
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
    console.error("DB Insert error:", dbError.message);
    alert('Signup failed at DB level: ' + dbError.message);
    return;
  }

  alert('Signup successful! Please check your email for a magic login link.');
});










// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// const supabaseUrl = 'https://xhuyzhlutarpffhdwbni.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM';
// const supabase = createClient(supabaseUrl, supabaseKey);

// document.getElementById('registerForm').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const full_name = document.getElementById('fullname').value.trim();
//   const email = document.getElementById('email').value.trim();
//   const username = document.getElementById('username').value.trim();
//   const location = document.getElementById('location').value.trim();
//   const phone = document.getElementById('phone').value.trim();
//   const pin = document.getElementById('pin').value.trim();
//   const password = document.getElementById('password').value;

//   if (!/^\d{4}$/.test(pin)) {
//     showAlert("PIN must be 4 digits.");
//     return;
//   }

//   // 1. Check if username or phone already exists
//   const { data: existingUsers, error: existingError } = await supabase
//     .from('users')
//     .select('id')
//     .or(`username.eq.${username},phone.eq.${phone}`);

//   if (existingError) {
//     console.error("User check failed:", existingError.message);
//     showAlert('Something went wrong while checking existing users.');
//     return;
//   }

//   if (existingUsers.length > 0) {
//     showAlert('Username or Phone number already exists. Please use a different one.');
//     return;
//   }

//   // 2. Create Supabase Auth account with email confirmation redirect
//   const { data: authData, error: authError } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       emailRedirectTo: 'https://www.bizzybillsng.store/verified.html' // change to your domain
//     }
//   });

//   if (authError) {
//     console.error("Auth sign-up error:", authError);
//     showAlert('Signup failed: ' + authError.message);
//     return;
//   }

//   const userId = authData?.user?.id;

//   if (!userId) {
//     showAlert('Signup failed: User ID missing.');
//     return;
//   }

//   // 3. Insert user record into custom 'users' table
//   const { error: dbError } = await supabase
//     .from('users')
//     .insert([{
//       id: userId,
//       full_name,
//       pin,
//       email,
//       password,
//       phone,
//       location,
//       username,
//       wallet_balance: 0,
//       account_number: '',     // will be updated after Opay/Kuda succeeds
//       account_type: 'regular',
//       history: [],
//       notifications: []
//     }]);

//   if (dbError) {
//     console.error("DB Insert error:", dbError.message);
//     showAlert('Signup failed at DB level: ' + dbError.message);
//     return;
//   }

//   showAlert('Signup successful! Please verify your email before logging in.');

//   // ✅ OPTIONAL: Trigger account number creation (Opay/Kuda) here
//   // await createDedicatedAccount(userId, full_name, phone);

// });
