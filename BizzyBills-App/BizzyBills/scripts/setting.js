import { supabase, getCurrentUser } from './user.js';

// Create modals
function createModal(contentHTML, confirmCallback) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'custom-modal';
  modal.innerHTML = contentHTML;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  modalOverlay.querySelector('.cancel-btn')?.addEventListener('click', () => {
    modalOverlay.remove();
  });

  modalOverlay.querySelector('.confirm-btn')?.addEventListener('click', async () => {
    const passwordInput = modalOverlay.querySelector('#confirm-password')?.value;
    if (confirmCallback) await confirmCallback(passwordInput, modalOverlay);
  });
}

// Password verification modal
function showSensitiveModal(username, type, revealCallback) {
  const labelText = type === 'pin' ? 'Transaction Pin' : 'Password';
  const contentHTML = `
    <h3>Hello @${username},</h3>
    <p>We detected you want to view your account ${labelText}. Please confirm it's really you by entering your password below.</p>
    <input type="password" id="confirm-password" placeholder="Enter your account password" />
    <div class="modal-buttons">
      <button class="cancel-btn">Cancel</button>
      <button class="confirm-btn">Confirm</button>
    </div>
  `;
  createModal(contentHTML, async (inputPassword, modalOverlay) => {
    const { data: userData, error } = await supabase.auth.getUser();
    if (userData?.user?.email) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: inputPassword,
      });

      if (error) {
        alert('Incorrect password.');
      } else {
        modalOverlay.remove();
        revealCallback();
      }
    }
  });
}

// Account termination modal
function showTerminationModal(username) {
  const contentHTML = `
    <h3>@${username}</h3>
    <p>Are you really sure you want to permanently terminate your BizzyBills Account?<br>This action cannot be undone.</p>
    <div class="modal-buttons">
      <button class="cancel-btn">Cancel</button>
      <button class="confirm-btn" style="background-color: red; color: white;">Terminate Anyway</button>
    </div>
  `;

  createModal(contentHTML, async (_, modalOverlay) => {
    const { error } = await supabase.auth.signOut();
    await supabase.from('users').delete().eq('id', user.id);
    alert('Your account has been terminated.');
    window.location.href = 'signup.html';
  });
}

// DOM Ready
window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert("Not logged in.");
    window.location.href = "login.html";
    return;
  }

  // Populate fields
  document.querySelector('.profile-card h3').textContent = user.full_name;
  document.querySelector('.wallet-amount strong').textContent = `₦${user.wallet_balance.toLocaleString()}`;
  document.getElementById('username').textContent = user.username;
  document.getElementById('email').textContent = user.email;

  // Blur sensitive fields
  const passwordEl = document.getElementById('pass-safety');
  const pinEl = document.getElementById('pin-safety');

  passwordEl.textContent = '••••••••';
  pinEl.textContent = '••••';

  passwordEl.style.filter = 'blur(4px)';
  pinEl.style.filter = 'blur(4px)';
  passwordEl.style.cursor = 'pointer';
  pinEl.style.cursor = 'pointer';

  // Click-to-unblur
  passwordEl.addEventListener('click', () => {
    showSensitiveModal(user.username, 'password', () => {
      passwordEl.textContent = user.password;
      passwordEl.style.filter = 'none';
    });
  });

  pinEl.addEventListener('click', () => {
    showSensitiveModal(user.username, 'pin', () => {
      pinEl.textContent = user.pin;
      pinEl.style.filter = 'none';
    });
  });

  // Logout switch
  document.getElementById('logoutSwitch').addEventListener('change', function () {
    if (this.checked) {
      setTimeout(() => {
        supabase.auth.signOut();
        window.location.href = 'index.html';
      }, 500);
    }
  });

  // Terminate account
  const terminateEl = document.querySelector('.Dangerzone .value');
  if (terminateEl.textContent === 'Terminate Account') {
    terminateEl.style.cursor = 'pointer';
    terminateEl.addEventListener('click', () => {
      showTerminationModal(user);
    });
  }
});






window.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();

  if (!user) {
    alert("Not logged in.");
    window.location.href = "login.html";
    return;
  }

  // ✅ Profile picture upload logic starts here
  const profilePic = document.querySelector('.profile-pic');

  if (user.profile_picture) {
    profilePic.src = user.profile_picture;
  }

  profilePic.style.cursor = 'pointer';

  profilePic.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // Validate size
      if (file.size > 2 * 1024 * 1024) {
        alert("File too large! Please select an image under 2MB.");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        alert('Upload failed: ' + uploadError.message);
        return;
      }

      // Get public URL
      const { data: publicUrlData, error: urlError } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (urlError || !publicUrlData?.publicUrl) {
        alert('Failed to retrieve image URL.');
        return;
      }

      // Save URL to database
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: publicUrlData.publicUrl })
        .eq('id', user.id);

      if (updateError) {
        alert('Failed to update profile picture in DB: ' + updateError.message);
        return;
      }

      // Update UI
      profilePic.src = publicUrlData.publicUrl;
      alert('Profile picture updated!');
    };
  });
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

