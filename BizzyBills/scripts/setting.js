import { supabase, getCurrentUser } from './user.js';

window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert("Not logged in.");
    window.location.href = "login.html";
    return;
  }

  document.querySelector('.profile-card h3').textContent = user.full_name;
  document.querySelector('.wallet-amount strong').textContent = `₦${user.wallet_balance.toLocaleString()}`;
  document.querySelectorAll('.setting-row .value')[0].textContent = user.password || '********';
  document.querySelectorAll('.setting-row .value')[1].textContent = user.pin || '****';
  document.querySelectorAll('.setting-row .value')[2].textContent = user.email;
  document.querySelectorAll('.setting-row .value')[3].textContent = user.username;

  const profilePic = document.querySelector('.profile-pic');
  if (user.profile_picture) {
    profilePic.src = user.profile_picture;
  }

  profilePic.style.cursor = 'pointer';

  profilePic.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const fileName = `${user.id}_${Date.now()}.${file.name.split('.').pop()}`;

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

      const { data: publicURL } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(fileName);

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









document.getElementById('logoutSwitch').addEventListener('change', function() {
  if (this.checked) {
    // Optional: Add animation or confirmation
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 500); // Delay for UX
  }
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
