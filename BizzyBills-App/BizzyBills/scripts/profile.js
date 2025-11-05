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




async function checkNotifications() {
  const user = await getCurrentUser();
  if (!user) return;

  const notifications = user.notifications || [];
  if (notifications.length === 0) return;

  const latest = notifications[notifications.length - 1];

  // 🕒 Get last viewed timestamp
  const lastSeen = localStorage.getItem(`lastSeen_${user.id}`);
  const lastViewed = localStorage.getItem(`lastViewed_${user.id}`); // NEW: when user clicked bell

  // Count unread = notifications newer than lastViewed
  let unreadCount = 0;
  if (lastViewed) {
    const lastViewedTime = parseInt(lastViewed);
    unreadCount = notifications.filter(n => new Date(n.timestamp).getTime() > lastViewedTime).length;
  } else {
    unreadCount = notifications.length; // if first time, all are unread
  }

  // 🔔 Show badge if there are unread messages
  if (unreadCount > 0) {
    showNotificationBadge(unreadCount);
  } else {
    clearNotificationBadge();
  }

  // 📢 Show popup if new since lastSeen
  const latestTimestamp = new Date(latest.timestamp).getTime();
  if (!lastSeen || latestTimestamp > parseInt(lastSeen)) {
    showPopupAlert(`Hey @${user.username}, you received inbox in your notification box!`);
    showSystemNotification(latest.title, latest.body);
  }

  // Save last seen notification timestamp
  localStorage.setItem(`lastSeen_${user.id}`, latestTimestamp);
}

// Show badge
function showNotificationBadge(count) {
  let bell = document.querySelector('.bell-icon');
  if (!bell) return;

  let oldBadge = document.querySelector('.notification-badge');
  if (oldBadge) oldBadge.remove();

  let badge = document.createElement('span');
  badge.className = 'notification-badge';
  badge.textContent = count;
  bell.parentElement.style.position = 'relative';
  bell.parentElement.appendChild(badge);
}

// Remove badge
function clearNotificationBadge() {
  let oldBadge = document.querySelector('.notification-badge');
  if (oldBadge) oldBadge.remove();
}

// Popup alert (like iPhone top popup)
function showPopupAlert(message) {
  let popup = document.createElement('div');
  popup.className = 'popup-alert';
  popup.textContent = message;

  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add('show'), 100);
  setTimeout(() => popup.classList.remove('show'), 4000);
  setTimeout(() => popup.remove(), 4500);
}

// System notification
function showSystemNotification(title, body) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
}

// 👇 Listen for bell click to mark notifications as "viewed"
document.addEventListener("DOMContentLoaded", () => {
  const bellLink = document.querySelector('a[href="notifications.html"]');
  if (bellLink) {
    bellLink.addEventListener("click", async () => {
      const user = await getCurrentUser();
      if (user && user.notifications && user.notifications.length > 0) {
        const latestTimestamp = new Date(user.notifications[user.notifications.length - 1].timestamp).getTime();
        localStorage.setItem(`lastViewed_${user.id}`, latestTimestamp); // mark as read
      }
    });
  }
});

checkNotifications();




















// updating notification bar
// async function checkNotifications() {
//   const user = await getCurrentUser();
//   if (!user) return;

//   const notifications = user.notifications || [];

//   if (notifications.length === 0) return;

//   const latest = notifications[notifications.length - 1];

//   showNotificationBadge(notifications.length);

//   const lastSeen = localStorage.getItem(`lastSeen_${user.id}`);
//   const latestTimestamp = new Date(latest.timestamp).getTime();

//   if (!lastSeen || latestTimestamp > parseInt(lastSeen)) {
//     showPopupAlert(`Hey @${user.username}, you received inbox in your notification box!`);
//     showSystemNotification(latest.title, latest.body);
//   }

//   localStorage.setItem(`lastSeen_${user.id}`, latestTimestamp);
// }

// function showNotificationBadge(count) {
//   let bell = document.querySelector('.bell-icon');
//   if (!bell) return;

//   let oldBadge = document.querySelector('.notification-badge');
//   if (oldBadge) oldBadge.remove();

//   let badge = document.createElement('span');
//   badge.className = 'notification-badge';
//   badge.textContent = count;
//   bell.parentElement.style.position = 'relative';
//   bell.parentElement.appendChild(badge);
// }

// function showPopupAlert(message) {
//   let popup = document.createElement('div');
//   popup.className = 'popup-alert';
//   popup.textContent = message;

//   document.body.appendChild(popup);

//   setTimeout(() => popup.classList.add('show'), 100);
//   setTimeout(() => popup.classList.remove('show'), 4000);
//   setTimeout(() => popup.remove(), 4500);
// }

// function showSystemNotification(title, body) {
//   if (!("Notification" in window)) return;

//   if (Notification.permission === "granted") {
//     new Notification(title, { body });
//   } else if (Notification.permission !== "denied") {
//     Notification.requestPermission().then(permission => {
//       if (permission === "granted") {
//         new Notification(title, { body });
//       }
//     });
//   }
// }

// checkNotifications();
