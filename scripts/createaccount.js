// scripts/createaccount.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your actual Supabase values
const supabaseUrl = 'https://xhuyzhlutarpffhdwbni.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM';
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const full_name = document.getElementById('fullname').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const location = document.getElementById('location').value;
  const phone = document.getElementById('phone').value;
  const pin = document.getElementById('pin').value;
  const password = document.getElementById('password').value;

  // Validate PIN length
  if (!/^\d{4}$/.test(pin)) {
    alert("PIN must be 4 digits.");
    return;
  }

  // Sign up user using Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        pin,
        username,
        location,
        phone,
        wallet_balance: 0,
        account_type: 'regular',
        history: []
      }
    }
  });

  if (error) {
    alert('Signup failed: ' + error.message);
    return;
  }

  alert('Signup successful! Please verify your email before logging in.');
});
