// scripts/welcome.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://xhuyzhlutarpffhdwbni.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
  const lastUser = JSON.parse(localStorage.getItem('lastUser'));
  const modal = document.getElementById('custom-modal');
  const modalMessage = document.getElementById('modal-message');
  const modalClose = document.getElementById('modal-close-btn');

  function showModal(message) {
    modalMessage.textContent = message;
    modal.classList.add('show');

    modalClose.onclick = () => {
      modal.classList.remove('show');
    };
  }

  if (!lastUser) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('username-display').textContent = `@${lastUser.username}`;

  document.getElementById('sign-in-btn').addEventListener('click', async () => {
    const password = document.getElementById('password-input').value;
    if (!password) {
      showModal('Please enter your password');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: lastUser.email,
      password
    });

    if (error) {
      showModal('Incorrect password. Try again.');
      return;
    }

    showModal('Welcome back!');
    setTimeout(() => {
      window.location.href = '../BizzyBills/home.html';
    }, 1200);
  });

  document.getElementById('sign-out-btn').addEventListener('click', () => {
    localStorage.removeItem('lastUser');
    supabase.auth.signOut();
    window.location.href = 'login.html';
  });
});
