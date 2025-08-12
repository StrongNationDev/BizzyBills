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
