// server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/data', async (req, res) => {
  const { network, mobile_number, plan, Ported_number } = req.body;

  try {
    const response = await fetch('https://sambaswallet.com/api/data/', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.SAMBASWALLET_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        network,
        mobile_number,
        plan,
        Ported_number
      })
    });

    const result = await response.json();

    // If Sambaswallet doesn't return a body, just check status code
    if (!response.ok || result.status !== "successful") {
      return res.status(400).json({ status: "failed", message: "Data transaction failed" });
    }

    return res.status(200).json({
      status: "successful",
      transaction_id: result.ref || `TX-${Date.now()}`,
      amount: req.body.amount,
      plan_label: req.body.plan_label,
      phone: mobile_number
    });
  } catch (err) {
    console.error("Data purchase error:", err);
    return res.status(500).json({ status: "failed", message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ BizzyBills server running at http://localhost:${PORT}`);
});





// // server.js
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import fetch from 'node-fetch';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(bodyParser.json());

// const API_URL = 'https://sambaswallet.com/api/topup/';
// const API_KEY = process.env.SAMBASWALLET_API_KEY;

// app.post('/api/airtime', async (req, res) => {
//   const payload = req.body;

//   console.log("Incoming airtime request:", JSON.stringify(payload, null, 2));

//   try {
//     const response = await fetch(API_URL, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Token ${API_KEY}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(payload)
//     });

//     const data = await response.json();

//     console.log("Sambaswallet API response:", JSON.stringify(data, null, 2));

//     if (!response.ok) {
//       return res.status(response.status).json({ error: data });
//     }

//     return res.status(200).json(data);

//   } catch (error) {
//     console.error('Error contacting Sambaswallet:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ BizzyBills proxy running: http://localhost:${PORT}`);
// });
