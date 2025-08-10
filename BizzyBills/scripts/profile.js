import { getCurrentUser } from './user.js';

document.addEventListener('DOMContentLoaded', async () => {
  const profilePicEl = document.querySelector('.profile-pic');

  if (!profilePicEl) return;

  profilePicEl.addEventListener('click', () => {
    window.location.href = 'profile.html';
  });

  const userData = await getCurrentUser();

  if (userData && userData.profile_picture) {
    profilePicEl.src = userData.profile_picture;
  } else {
    profilePicEl.src = 'icons/me.png';
  }
});
