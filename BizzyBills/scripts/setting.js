// scripts/settings.js
import { supabase, getCurrentUser } from './user.js';

window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert("Not logged in.");
    window.location.href = "login.html";
    return;
  }

  // 1. Populate user info
  document.querySelector('.profile-card h3').textContent = user.full_name;
  document.querySelector('.wallet-amount strong').textContent = `₦${user.wallet_balance.toLocaleString()}`;
  document.querySelectorAll('.setting-row .value')[0].textContent = user.password || '********';
  document.querySelectorAll('.setting-row .value')[1].textContent = user.pin || '****';
  document.querySelectorAll('.setting-row .value')[2].textContent = user.email;
  document.querySelectorAll('.setting-row .value')[3].textContent = user.username;

  // 2. Display profile picture if available
  const profilePic = document.querySelector('.profile-pic');
  if (user.profile_picture) {
    profilePic.src = user.profile_picture;
  }

  // 3. Handle profile picture click/upload
  profilePic.style.cursor = 'pointer';

  profilePic.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const fileName = `${user.id}_${Date.now()}.${file.name.split('.').pop()}`;

      // Upload to Supabase Storage (bucket: avatars)
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        alert('Upload failed: ' + error.message);
        return;
      }

      // Get public URL
      const { data: publicURL } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Save to user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: publicURL.publicUrl })
        .eq('id', user.id);

      if (updateError) {
        alert('Failed to save profile picture: ' + updateError.message);
        return;
      }

      profilePic.src = publicURL.publicUrl;
      alert('Profile picture updated!');
    };

    input.click();
  });
});
