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



// notification alerting updating
import { getCurrentUser, supabase } from './user.js';

// Function to check notifications
export async function checkNotifications() {
  const user = await getCurrentUser();
  if (!user) return;

  // Fetch notifications for this user
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return;
  }

  // Find unread notifications
  const unread = notifications.filter(n => !n.is_read);

  // Update badge count
  const badge = document.getElementById('notification-badge');
  if (unread.length > 0) {
    badge.style.display = 'inline-block';
    badge.textContent = unread.length;
  } else {
    badge.style.display = 'none';
  }

  // Check if user is logging in after a new message was sent
  const lastLogin = new Date(user.last_login || user.updated_at); // adjust based on your schema
  const newMessages = notifications.filter(n => new Date(n.created_at) > lastLogin);

  if (newMessages.length > 0) {
    showPopupAlert(`Hey @${user.username}, you received inbox in your notification box`);
    triggerPushNotification("New Notification", "You received a new inbox message.");
  }
}

// Pop-up alert function
function showPopupAlert(message) {
  const popup = document.createElement('div');
  popup.classList.add('popup-alert');
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add('show'), 100);
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 500);
  }, 5000);
}

// Push notification (phone/desktop notification bar)
async function triggerPushNotification(title, body) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification(title, { body });
    }
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  checkNotifications();
  // Optional: poll every 30s for updates
  setInterval(checkNotifications, 30000);
});
