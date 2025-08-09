import { getCurrentUser } from './user.js';

document.addEventListener('DOMContentLoaded', async () => {
  const profilePicEl = document.querySelector('.profile-pic');

  if (!profilePicEl) return;

  // Click to go to profile page
  profilePicEl.addEventListener('click', () => {
    window.location.href = 'profile.html';
  });

  // Get current user data
  const userData = await getCurrentUser();

  if (userData && userData.profile_picture) {
    // If profile picture exists in DB, replace image source
    profilePicEl.src = userData.profile_picture;
  } else {
    // Keep default if no picture uploaded
    profilePicEl.src = 'icons/me.png';
  }
});
