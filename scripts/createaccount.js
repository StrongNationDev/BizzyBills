import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://xhuyzhlutarpffhdwbni.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM';
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

  // 2. Create Supabase Auth account with email confirmation redirect
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://www.bizzybillsng.store/verified.html' // change to your domain
    }
  });

  if (authError) {
    console.error("Auth sign-up error:", authError);
    alert('Signup failed: ' + authError.message);
    return;
  }

  const userId = authData?.user?.id;

  if (!userId) {
    alert('Signup failed: User ID missing.');
    return;
  }

  // 3. Insert user record into custom 'users' table
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
      account_number: '',     // will be updated after Opay/Kuda succeeds
      account_type: 'regular',
      history: [],
      notifications: []
    }]);

  if (dbError) {
    console.error("DB Insert error:", dbError.message);
    alert('Signup failed at DB level: ' + dbError.message);
    return;
  }

  alert('Signup successful! Please verify your email before logging in.');

  // ✅ OPTIONAL: Trigger account number creation (Opay/Kuda) here
  // await createDedicatedAccount(userId, full_name, phone);

});


// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// const supabaseUrl = 'https://xhuyzhlutarpffhdwbni.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM';
// const supabase = createClient(supabaseUrl, supabaseKey);

// document.getElementById('registerForm').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const full_name = document.getElementById('fullname').value;
//   const email = document.getElementById('email').value;
//   const username = document.getElementById('username').value;
//   const location = document.getElementById('location').value;
//   const phone = document.getElementById('phone').value;
//   const pin = document.getElementById('pin').value;
//   const password = document.getElementById('password').value;

//   if (!/^\d{4}$/.test(pin)) {
//     alert("PIN must be 4 digits.");
//     return;
//   }

//   // updated part

//   // 1. Create user in Supabase Auth
//   const { data: authData, error: authError } = await supabase.auth.signUp({
//     email,
//     password
//   });

//   if (authError) {
//     alert('Signup failed: ' + authError.message);
//     return;
//   }

//   const userId = authData.user.id;

//   // 2. Insert user into your custom 'public.users' table
//   const { error: dbError } = await supabase
//     .from('users')
//     .insert([
//       {
//         id: userId, // match the UUID from auth
//         full_name,
//         pin,
//         email,
//         password,
//         phone,
//         location,
//         username,
//         wallet_balance: 0,
//         account_number: '',
//         account_type: 'regular',
//         history: []
//       }
//     ]);

//   if (dbError) {
//     alert('Signup failed at DB level: ' + dbError.message);
//     return;
//   }

//   alert('Signup successful! Please verify your email before logging in.');
// });


























// // scripts/createaccount.js
// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// // Replace with your actual Supabase values
// const supabaseUrl = 'https://xhuyzhlutarpffhdwbni.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM';
// const supabase = createClient(supabaseUrl, supabaseKey);

// document.getElementById('registerForm').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const full_name = document.getElementById('fullname').value;
//   const email = document.getElementById('email').value;
//   const username = document.getElementById('username').value;
//   const location = document.getElementById('location').value;
//   const phone = document.getElementById('phone').value;
//   const pin = document.getElementById('pin').value;
//   const password = document.getElementById('password').value;

//   // Validate PIN length
//   if (!/^\d{4}$/.test(pin)) {
//     alert("PIN must be 4 digits.");
//     return;
//   }

//   // Sign up user using Supabase Auth
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         full_name,
//         pin,
//         username,
//         location,
//         phone,
//         wallet_balance: 0,
//         account_type: 'regular',
//         history: []
//       }
//     }
//   });

//   if (error) {
//     alert('Signup failed: ' + error.message);
//     return;
//   }

//   alert('Signup successful! Please verify your email before logging in.');
// });
