import { supabase } from './supabase.js';

const emailInput = document.getElementById('email');
const resetBtn = document.getElementById('reset-btn');
const message = document.getElementById('message');

resetBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();

  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password.html`
  });

  if (error) {
    alert(error.message);
  } else {
    message.style.display = 'block';
    message.textContent = "A password reset link has been sent to your email.";
    emailInput.value = '';
  }
});
