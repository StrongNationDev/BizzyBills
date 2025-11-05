import { supabase, getCurrentUser } from './user.js';

window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert('You are not logged in or your profile is missing.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('balance-amount').textContent = `₦${user.wallet_balance.toLocaleString()}`;
  document.querySelector('.welcome-text strong').textContent = user.username;

});






// screen loader
window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert('You are not logged in or your profile is missing.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('loading-overlay').classList.add('fade-out');
});



  document.addEventListener("DOMContentLoaded", () => {
    const loadingBar = document.querySelector(".loading-bar");
    let progress = 0;

    // Simulate loading progress
    const interval = setInterval(() => {
      progress += 5; // increase by 5% each step
      loadingBar.style.width = progress + "%";

      if (progress >= 100) {
        clearInterval(interval);
        // fade out after complete
        setTimeout(() => {
          document.getElementById("loading-overlay").classList.add("fade-out");
        }, 300);
      }
    }, 100); // update every 100ms
  });

