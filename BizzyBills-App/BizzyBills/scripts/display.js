        import { supabase } from './user.js';

        async function loadUsers() {
            const usersDiv = document.getElementById('users');

            const { data, error } = await supabase
                .from('users')
                .select('*');

            if (error) {
                usersDiv.innerHTML = `<p>Error loading users: ${error.message}</p>`;
                return;
            }

            if (!data || data.length === 0) {
                usersDiv.innerHTML = `<p>No users found.</p>`;
                return;
            }

            // Display every field of each user
            usersDiv.innerHTML = data.map(user => {
                let fieldsHTML = "";

                // Loop through all keys in one user record
                for (const key in user) {
                    fieldsHTML += `
                        <p><strong>${key}:</strong> ${user[key] !== null ? user[key] : "(null)"}</p>
                    `;
                }

                return `
                    <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
                        ${fieldsHTML}
                    </div>
                `;
            }).join('');
        }

        loadUsers();
