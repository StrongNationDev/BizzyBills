// scripts/login.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://xhuyzhlutarpffhdwbni.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM';
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailOrUsername = document.getElementById('emailOrUsername').value;
  const password = document.getElementById('password').value;

  let emailToUse = emailOrUsername;

  // If it's not an email, treat as username and resolve
  if (!emailOrUsername.includes('@')) {
    const { data: userData, error } = await supabase
      .from('users')
      .select('email')
      .eq('username', emailOrUsername)
      .single();

    if (error || !userData) {
      alert('Username not found.');
      return;
    }

    emailToUse = userData.email;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailToUse,
    password
  });

  if (error) {
    alert('Your Login attempt has failed, please try again. ' + error.message);
    return;
  }

  // Optional: redirect to dashboard or homepage
  alert('You have Logged into your account successful!');
  window.location.href = '../BizzyBills/home.html';
});
