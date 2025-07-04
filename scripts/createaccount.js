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
    password,
    options: {
      emailRedirectTo: 'https://www.bizzybillsng.store/verified.html'
    }
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

  alert('Signup successful! Please check your email to verify your account.');
});






// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// // Supabase credentials
// const supabaseUrl = 'https://xhuyzhlutarpffhdwbni.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM';
// const supabase = createClient(supabaseUrl, supabaseKey);

// // Moniepoint API credentials
// const MONIEPOINT_API_KEY = 'bNMitV(G5GB!6CeWD4n9';
// const MONIEPOINT_CLIENT_ID = 'api-client-8942264-6f665d83-e172-46ef-b5ca-d74791c1ecd4';

// // Create Moniepoint virtual account
// async function createMoniepointAccount(userId, full_name, phone, email) {
//   try {
//     const response = await fetch("https://api.moniepoint.com/virtual-account", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-API-KEY": MONIEPOINT_API_KEY,
//         "Client-ID": MONIEPOINT_CLIENT_ID
//       },
//       body: JSON.stringify({
//         account_name: full_name,
//         bvn: "00000000000", // You can replace this with real BVN later if required
//         phone_number: phone,
//         email: email,
//         customer_reference: userId
//       })
//     });

//     const result = await response.json();

//     if (!response.ok || !result.account_number) {
//       console.error("Moniepoint Error:", result);
//       return null;
//     }

//     return result.account_number;
//   } catch (err) {
//     console.error("Moniepoint API Failed:", err.message);
//     return null;
//   }
// }

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
//     alert("PIN must be 4 digits.");
//     return;
//   }

//   // 1. Check for duplicate username or phone
//   const { data: existingUsers, error: existingError } = await supabase
//     .from('users')
//     .select('id')
//     .or(`username.eq.${username},phone.eq.${phone}`);

//   if (existingError) {
//     console.error("User check failed:", existingError.message);
//     alert('Something went wrong while checking existing users.');
//     return;
//   }

//   if (existingUsers.length > 0) {
//     alert('Username or Phone number already exists. Please use a different one.');
//     return;
//   }

//   // 2. Sign up in Supabase Auth
//   const { data: authData, error: authError } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       emailRedirectTo: 'https://www.bizzybillsng.store/verified.html'
//     }
//   });

//   if (authError) {
//     console.error("Auth sign-up error:", authError.message);
//     alert('Signup failed: ' + authError.message);
//     return;
//   }

//   const userId = authData?.user?.id;
//   if (!userId) {
//     alert('Signup failed: No user ID returned.');
//     return;
//   }

//   // 3. Insert into Supabase Database
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
//       account_number: '',
//       account_type: 'regular',
//       history: [],
//       notifications: []
//     }]);

//   if (dbError) {
//     console.error("DB Insert error:", dbError.message);
//     alert('Signup failed at DB level: ' + dbError.message);
//     return;
//   }

//   // 4. Create virtual account via Moniepoint
//   const accountNumber = await createMoniepointAccount(userId, full_name, phone, email);

//   if (accountNumber) {
//     const { error: updateError } = await supabase
//       .from('users')
//       .update({ account_number: accountNumber })
//       .eq('id', userId);

//     if (updateError) {
//       console.error("Account number update failed:", updateError.message);
//     }
//   }

//   alert('Signup successful! Please check your email for a magic login link.');
// });












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
//     alert("PIN must be 4 digits.");
//     return;
//   }

//   // 1. Check if username or phone already exists
//   const { data: existingUsers, error: existingError } = await supabase
//     .from('users')
//     .select('id')
//     .or(`username.eq.${username},phone.eq.${phone}`);

//   if (existingError) {
//     console.error("User check failed:", existingError.message);
//     alert('Something went wrong while checking existing users.');
//     return;
//   }

//   if (existingUsers.length > 0) {
//     alert('Username or Phone number already exists. Please use a different one.');
//     return;
//   }

//   // 2. Sign up with magic link
//   const { data: authData, error: authError } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       emailRedirectTo: 'https://www.bizzybillsng.store/verified.html'
//     }
//   });

//   if (authError) {
//     console.error("Auth sign-up error:", authError.message);
//     alert('Signup failed: ' + authError.message);
//     return;
//   }

//   const userId = authData?.user?.id;
//   if (!userId) {
//     alert('Signup failed: No user ID returned.');
//     return;
//   }

//   // 3. Store user data in Supabase database
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
//       account_number: '',
//       account_type: 'regular',
//       history: [],
//       notifications: []
//     }]);

//   if (dbError) {
//     console.error("DB Insert error:", dbError.message);
//     alert('Signup failed at DB level: ' + dbError.message);
//     return;
//   }

//   alert('Signup successful! Please check your email for a magic login link.');

//   // ✅Trigger account number creation using (Moniepoint API) here
//   // await createDedicatedAccount(userId, full_name, phone);

// });
