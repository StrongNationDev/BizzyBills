// scripts/reset-password.js
import { supabase } from './supabase.js';

async function init() {
  const updateBtn = document.getElementById('update-btn');
  const newPasswordInput = document.getElementById('new-password');

  // Listen for password recovery session
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      console.log("Password recovery mode");
      updateBtn.addEventListener('click', async () => {
        const newPassword = newPasswordInput.value.trim();
        if (!newPassword) {
          alert("Please enter a new password.");
          return;
        }
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          alert("Error updating password: " + error.message);
        } else {
          alert("Password updated successfully. You can now log in.");
          window.location.href = "login.html";
        }
      });
    }
  });
}

init();
