// moniepoint.js (Node.js server file)
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors()); // Allow all origins or restrict to your domain
app.use(express.json());

// Moniepoint credentials
const MONIEPOINT_API_KEY = 'bNMitV(G5GB!6CeWD4n9';
const MONIEPOINT_CLIENT_ID = 'api-client-8942264-6f665d83-e172-46ef-b5ca-d74791c1ecd4';

app.post('/create-moniepoint-account', async (req, res) => {
  const { userId, full_name, phone, email } = req.body;

  if (!userId || !full_name || !phone || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await fetch('https://api.moniepoint.com/virtual-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': MONIEPOINT_API_KEY,
        'Client-ID': MONIEPOINT_CLIENT_ID,
      },
      body: JSON.stringify({
        account_name: full_name,
        bvn: '00000000000',  // placeholder if not required
        phone_number: phone,
        email: email,
        customer_reference: userId
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Moniepoint error response:", result);
      return res.status(400).json({ error: 'Failed to create account', details: result });
    }

    if (!result.account_number) {
      return res.status(400).json({ error: 'No account number returned', details: result });
    }

    return res.status(200).json({ account_number: result.account_number });

  } catch (err) {
    console.error('Moniepoint Server Error:', err.message);
    return res.status(500).json({ error: 'Moniepoint Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Moniepoint API proxy running on http://localhost:3000');
});
