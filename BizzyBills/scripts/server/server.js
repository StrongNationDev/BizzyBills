import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 5000;

// CONFIG: use env when available, fallback to values you've been using
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xhuyzhlutarpffhdwbni.supabase.co';
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTYwMzQ0NiwiZXhwIjoyMDY1MTc5NDQ2fQ.7Er7cDba8jM39v_NNtibxPl_rn9jLOqRahEr3R1hbGk';
const SAMBASWALLET_API_KEY = process.env.SAMBASWALLET_API_KEY || '27acb365cd9a4f08ce09c079c98d45c22880610e';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

app.use(cors());
app.use(express.json());

// Utility: parse number safely
function toNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (!value) return 0;
  const str = String(value).replace(/[^0-9.-]+/g, '');
  const n = parseFloat(str);
  return Number.isFinite(n) ? n : 0;
}

app.post('/api/data', async (req, res) => {
  try {
    console.log('📥 Incoming request body:', req.body);

    const {
      userId,
      network,
      plan,
      mobile_number,
      phone,
      Ported_number = true,
      amount,
      plan_label
    } = req.body;

    const mobile = mobile_number || phone;
    const amountNum = toNumber(amount);

    if (!userId || !network || !plan || !mobile) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // 1) Get user
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('wallet_balance, history, username')
      .eq('id', userId)
      .single();

    if (userErr || !user) {
      console.error('User fetch error:', userErr);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 2) Check wallet balance before calling external provider
    if (user.wallet_balance < amountNum) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // 3) Call Sambaswallet
    console.log('🌐 Sending request to Sambaswallet with:', { network, mobile, plan, Ported_number });
    const sambasResp = await fetch('https://sambaswallet.com/api/data/', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        // Sambas wants "Token <key>" per their docs (not Bearer)
        Authorization: `Token ${SAMBASWALLET_API_KEY}`,
      },
      body: JSON.stringify({
        network,
        mobile_number: mobile,
        plan,
        Ported_number,
      }),
    });

    // Try to parse body even on non-200 so we can log details
    let sambasJson = {};
    try {
      sambasJson = await sambasResp.json();
    } catch (e) {
      sambasJson = {};
    }
    console.log('✅ Sambaswallet response:', sambasJson);

    // Determine success using various possible keys
    const rawStatus = (sambasJson.Status || sambasJson.status || sambasJson.Status || '').toString();
    const sambasSuccess = sambasResp.ok && rawStatus.toLowerCase() === 'successful';

    if (!sambasSuccess) {
      // Return the provider details so the frontend can show meaningful message
      return res.status(500).json({
        success: false,
        status: rawStatus || 'failed',
        message: 'Sambaswallet returned failure',
        sambas: sambasJson,
      });
    }

    // 4) Sambas successful -> build a transaction record
    const transactionId = sambasJson.id ?? sambasJson.ident ?? `TX-${Date.now()}`;
    const planName = sambasJson.plan_name ?? sambasJson.plan_name ?? '';
    const planNetwork = sambasJson.plan_network ?? '';

    const transactionRecord = {
      id: transactionId,
      type: 'data',
      network: planNetwork || network,
      phone: mobile,
      plan: plan_label || planName,
      amount: amountNum,
      status: 'successful',
      provider_response: sambasJson,
      created_at: new Date().toISOString(),
    };

    // 5) Deduct wallet and update history
    const newBalance = Number(user.wallet_balance) - Number(amountNum);
    const newHistory = (user.history && Array.isArray(user.history)) ? [...user.history] : [];
    newHistory.unshift(transactionRecord);

    const { error: updateErr } = await supabase
      .from('users')
      .update({
        wallet_balance: newBalance,
        history: newHistory,
      })
      .eq('id', userId);

    if (updateErr) {
      console.error('Failed to update wallet/history:', updateErr);
      // Important: sambas already completed — inform client that provider succeeded but wallet update failed
      return res.status(500).json({
        success: true,
        status: 'successful',
        transaction_id: transactionId,
        wallet_updated: false,
        message: 'Provider success but failed to update user wallet. Contact admin.',
        sambas: sambasJson,
      });
    }

    // 6) All done - normalized response
    return res.json({
      success: true,
      status: 'successful',
      transaction_id: transactionId,
      new_balance: newBalance,
      transaction: transactionRecord,
    });

  } catch (err) {
    console.error('Server error in /api/data:', err);
    return res.status(500).json({ success: false, message: 'Server error', details: err.message });
  }
});

// (Optional) ping route
app.get('/', (req, res) => res.send('BizzyBills proxy is up'));

app.listen(PORT, () => {
  console.log(`✅ BizzyBills proxy running: http://localhost:${PORT}`);
});




























































































































// // import dotenv from 'dotenv';
// // dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import { createClient } from '@supabase/supabase-js';

// const app = express();
// const PORT = 5000;
// const SAMBASWALLET_API_KEY = "27acb365cd9a4f08ce09c079c98d45c22880610e";
// const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTYwMzQ0NiwiZXhwIjoyMDY1MTc5NDQ2fQ.7Er7cDba8jM39v_NNtibxPl_rn9jLOqRahEr3R1hbGk";// Supabase setup (optional)
// const supabase = createClient(
//   'https://xhuyzhlutarpffhdwbni.supabase.co',
//   SERVICE_ROLE_KEY
// );
// // Middlewares
// app.use(cors());
// app.use(express.json());

// // ROUTE: Buy Data
// app.post('/api/data', async (req, res) => {
//   console.log("📥 Incoming request body:", req.body);

//   const { network, mobile_number, plan, Ported_number } = req.body;

//   try {
//     if (!process.env.SAMBASWALLET_API_KEY) {
//       console.warn("❌ API key not found in environment variables!");
//     }

//     console.log("🌐 Sending request to Sambaswallet with:", {
//       network,
//       mobile_number,
//       plan,
//       Ported_number
//     });

//     const response = await fetch('https://sambaswallet.com/api/data/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Token ${SAMBASWALLET_API_KEY}`,
//       },
//       body: JSON.stringify({
//         network,
//         mobile_number,
//         plan,
//         Ported_number
//       }),
//     });

//     const result = await response.json();
//     console.log('✅ Sambaswallet response:', result);

//     if (!response.ok) {
//       return res.status(response.status).json({ error: 'Sambaswallet API Error', details: result });
//     }

//     res.json(result);
//   } catch (err) {
//     console.error('❌ Server Error:', err);
//     res.status(500).json({ error: 'Internal Server Error', details: err.message });
//   }
// });

// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// // ... existing imports and setup

// // ROUTE: Debit user wallet
// app.post('/api/debit_user', async (req, res) => {
//   const { userId, amount } = req.body;
//   console.log(`💳 Debiting user ${userId} an amount of ₦${amount}`);

//   try {
//     const { data, error } = await supabase
//       .from('users')
//       .update({ wallet_balance: supabase.raw(`wallet_balance - ${amount}`) })
//       .eq('id', userId);

//     if (error) throw error;
//     res.json({ success: true, newBalance: data[0]?.wallet_balance });
//   } catch (err) {
//     console.error("❌ Debit failed:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });


// app.listen(PORT, () => {
//   console.log(`✅ BizzyBills proxy running: http://localhost:${PORT}`);
// });
