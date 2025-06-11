  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    }, {
      data: { username, phone }
    });

    if (error) {
      alert("Signup failed: " + error.message);
    } else {
      alert("Signup successful! Please check your email.");
      window.location.href = 'login.html';
    }
  });





//   ffor login page


  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      alert("Login successful!");
      window.location.href = 'dashboard.html'; // or any page you want to go
    }
  });
