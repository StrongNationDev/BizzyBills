import { getCurrentUser, supabase } from './user.js'

// Function to format timestamp into a readable string
function formatTimestamp(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Update notifications array in Supabase for the current user
async function updateUserNotifications(userId, notifications) {
  const { error } = await supabase
    .from('users')
    .update({ notifications })
    .eq('id', userId)

  if (error) {
    console.error('Error updating notifications:', error)
    alert('Failed to update notifications.')
  }
}

// Render notifications to the page
function renderNotifications(notifications, userId) {
  const container = document.querySelector('.allnotifications')
  container.innerHTML = '' // Clear old notifications

  if (!notifications || notifications.length === 0) {
    container.innerHTML = '<p>No notifications found.</p>'
    return
  }

  notifications.forEach((notification, index) => {
    const card = document.createElement('div')
    card.classList.add('notification-card')

    card.innerHTML = `
      <div class="avatar"></div>
      <div class="content">
        <h3 class="message-title">${notification.title}</h3>
        <p class="message-body">${notification.body}</p>
        <span class="timestamp">${formatTimestamp(notification.timestamp)}</span>
      </div>
      <div class="actions">
        <button class="mark-read">Mark Read</button>
        <button class="delete">Delete</button>
      </div>
    `

    // MARK READ: visually change color
    card.querySelector('.mark-read').addEventListener('click', () => {
      card.classList.add('read')
      card.querySelector('.mark-read').disabled = true
    })

    // DELETE: remove from DB and re-render
    card.querySelector('.delete').addEventListener('click', async () => {
      const updatedNotifications = notifications.filter((_, i) => i !== index)
      await updateUserNotifications(userId, updatedNotifications)
      renderNotifications(updatedNotifications, userId) // re-render
    })

    container.appendChild(card)
  })
}

// Fetch and display the notifications
async function loadNotifications() {
  const user = await getCurrentUser()
  if (!user) {
    console.error('No user logged in.')
    document.querySelector('.allnotifications').innerHTML = '<p>Please log in to see notifications.</p>'
    return
  }

  renderNotifications(user.notifications, user.id)
}

// Load on page start
loadNotifications()
