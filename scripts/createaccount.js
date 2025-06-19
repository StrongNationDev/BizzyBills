import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://xhuyzhlutarpffhdwbni.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM'; // shortened for security
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;

    const { data, error } = await supabase
      .from('users')
      .insert([{ email, username, phone, password }]);

    if (error) {
      alert('Error: ' + error.message);
      console.error(error);
    } else {
      alert('Account created successfully!');
      window.location.href = 'login.html';
    }
  });
});
