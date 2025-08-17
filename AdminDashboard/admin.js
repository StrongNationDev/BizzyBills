const sendButton = document.getElementById('sendtoall')
const titleInput = document.querySelector('.message-title')
const bodyInput = document.querySelector('.message-body')

sendButton.addEventListener('click', async () => {
  const title = titleInput.value.trim()
  const body = bodyInput.value.trim()

  if (!title || !body) {
    alert('Please fill in both title and message body.')
    return
  }

  try {
    const res = await fetch('http://localhost:3000/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body })
    })

    if (!res.ok) throw new Error('Failed to send broadcast')

    alert('Broadcast message sent successfully!')
    titleInput.value = ''
    bodyInput.value = ''
  } catch (err) {
    console.error(err)
    alert('Failed to send broadcast.')
  }
})



// users fetching
const userList = document.getElementById('user-list')
const selectAllCheckbox = document.querySelector('#select-all input')

// Fetch and display users
async function loadUsers() {
  try {
    const res = await fetch('http://localhost:3000/users')
    const users = await res.json()

    if (!Array.isArray(users)) {
      console.error('Server did not return a user list:', users)
      return
    }
    
    userList.innerHTML = '' // clear old data

    users.forEach(user => {
      const userDiv = document.createElement('div')
      userDiv.classList.add('user')
      userDiv.dataset.id = user.id

      userDiv.innerHTML = `
        <div class="profile">
        <img src="https://via.placeholder.com/40" alt="Profile">
          <span>${user.name}</span>
        </div>
        <span>$${user.wallet_balance || 0}</span>
        <span>${user.email}</span>
        <input type="checkbox" class="user-checkbox">
      `
      userList.appendChild(userDiv)
    })
  } catch (err) {
    console.error('❌ Error loading users:', err)
  }
}

// Handle select all
selectAllCheckbox.addEventListener('change', () => {
  const checkboxes = document.querySelectorAll('.user-checkbox')
  checkboxes.forEach(cb => { cb.checked = selectAllCheckbox.checked })
})

// Delete selected users
async function deleteSelectedUsers() {
  const checkboxes = document.querySelectorAll('.user-checkbox:checked')
  const ids = Array.from(checkboxes).map(cb => cb.closest('.user').dataset.id)

  if (ids.length === 0) {
    alert('No users selected')
    return
  }

  if (!confirm(`Are you sure you want to delete ${ids.length} user(s)?`)) return

  try {
    const res = await fetch('http://localhost:3000/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    })

    if (!res.ok) throw new Error('Failed to delete users')

    alert('✅ User(s) deleted successfully')
    loadUsers() // refresh list
  } catch (err) {
    console.error(err)
    alert('❌ Failed to delete users')
  }
}

// Create a delete button
const deleteBtn = document.createElement('button')
deleteBtn.textContent = 'Delete Selected'
deleteBtn.classList.add('delete-btn')
deleteBtn.addEventListener('click', deleteSelectedUsers)
document.querySelector('.users').prepend(deleteBtn)

// Initial load
loadUsers()
