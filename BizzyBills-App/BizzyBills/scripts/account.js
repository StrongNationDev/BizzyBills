import { supabase, getCurrentUser } from './user.js';

document.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert('You must be logged in to view your virtual account.');
    window.location.href = 'login.html';
    return;
  }

  const nameElement = document.querySelector('.account-name');
  const numberElement = document.querySelector('.account-number');

  nameElement.textContent = user.full_name || 'Your Name';
  numberElement.textContent = user.account_number || '0000000000';
});

window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert('You are not logged in or your profile is missing.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('loading-overlay').classList.add('fade-out');
});

window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert('You are not logged in or your profile is missing.');
    window.location.href = 'login.html';
    return;
  }
document.getElementById('loading-overlay').classList.add('fade-out');
});
