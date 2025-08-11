sendButton.addEventListener('click', async () => {
    const title = titleInput.value.trim()
    const body = bodyInput.value.trim()

    if (!title || !body) {
        alert('Please fill in both title and message body.')
        return
    }

    try {
        const res = await fetch('/broadcast', {
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














// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// // const SUPERBASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTYwMzQ0NiwiZXhwIjoyMDY1MTc5NDQ2fQ.7Er7cDba8jM39v_NNtibxPl_rn9jLOqRahEr3R1hbGk'
// const SUPABASE_URL = 'https://xhuyzhlutarpffhdwbni.supabase.co'
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM' 
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// const sendButton = document.getElementById('sendtoall')
// const titleInput = document.querySelector('.message-title')
// const bodyInput = document.querySelector('.message-body')

// sendButton.addEventListener('click', async () => {
//     const title = titleInput.value.trim()
//     const body = bodyInput.value.trim()

//     if (!title || !body) {
//         alert('Please fill in both title and message body.')
//         return
//     }

//     const message = {
//         title,
//         body,
//         timestamp: new Date().toISOString()
//     }

//     try {
//         const { data: users, error: fetchError } = await supabase
//             .from('users')
//             .select('id, notifications')

//         if (fetchError) throw fetchError

//         const updates = users.map(user => {
//             const currentNotifications = user.notifications || []
//             return {
//                 id: user.id,
//                 notifications: [...currentNotifications, message]
//             }
//         })

//         const { error: updateError } = await supabase
//             .from('users')
//             .upsert(updates, { onConflict: 'id' })

//         if (updateError) throw updateError

//         alert('Broadcast message sent successfully!')
//         titleInput.value = ''
//         bodyInput.value = ''
//     } catch (err) {
//         console.error('Error sending broadcast:', err)
//         alert('Failed to send broadcast.')
//     }
// })
