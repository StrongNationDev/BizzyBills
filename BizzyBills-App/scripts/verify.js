  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  const supabase = createClient(
    'https://xhuyzhlutarpffhdwbni.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM0NDYsImV4cCI6MjA2NTE3OTQ0Nn0.upEAFWSU9GD5-qLwHtuV2eb9yHKEFs_JTaN-quymXaM'
  );

  const container = document.querySelector('.container');

  async function triggerMoniepointAccount() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user) {
      container.innerHTML = `
        <h1>Error ⚠️</h1>
        <p>We couldn’t verify your session. Please log in again.</p>
        <a href="login.html">Go to Login</a>
      `;
      return;
    }

    const userId = user.id;

    // Fetch user profile from DB
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('full_name, phone, email, account_number')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      container.innerHTML = `
        <h1>Error ⚠️</h1>
        <p>We couldn’t find your account details. Please contact support.</p>
      `;
      return;
    }

    if (profile.account_number) {
      container.innerHTML = `
        <div class="emoji">✅</div>
        <h1>Email Verified!</h1>
        <p>Your virtual account is already created.</p>
        <p><strong>Account Number:</strong> ${profile.account_number}</p>
        <a href="login.html">Log In</a>
      `;
      return;
    }

    // Trigger your server to create a Moniepoint account
    try {
      const res = await fetch('http://localhost:3000/create-moniepoint-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          full_name: profile.full_name,
          phone: profile.phone,
          email: profile.email
        })
      });

      const result = await res.json();

      if (result.success && result.account_number) {
        container.innerHTML = `
          <div class="emoji">✅</div>
          <h1>Account Created!</h1>
          <p>Your virtual account is ready.</p>
          <p><strong>Account Number:</strong> ${result.account_number}</p>
          <a href="login.html">Log In</a>
        `;
      } else {
        throw new Error(result.message || "Unknown error");
      }

    } catch (err) {
      container.innerHTML = `
        <h1>Email Verified ✅</h1>
        <p>We verified your email, but couldn’t create your account number.</p>
        <p>Error: ${err.message}</p>
        <a href="login.html">Continue</a>
      `;
    }
  }

  triggerMoniepointAccount();
