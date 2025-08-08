// this is the complete api for airtime purchase
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  'https://xhuyzhlutarpffhdwbni.supabase.co',
  process.env.SERVICE_ROLE_KEY
);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const API_URL = 'https://sambaswallet.com/api/topup/';
const API_KEY = process.env.SAMBASWALLET_API_KEY;

app.post('/api/airtime', async (req, res) => {
  const payload = req.body;

  console.log("Incoming airtime request:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log("Sambaswallet API response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error contacting Sambaswallet:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Debit user before airtime is sent
app.post('/api/debit-user', async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.wallet_balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const newBalance = user.wallet_balance - amount;

    const { error: updateError } = await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to debit wallet' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Debit error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Refund user if airtime fails
app.post('/api/refund-user', async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const newBalance = user.wallet_balance + amount;

    const { error: updateError } = await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      return res.status(500).json({ error: 'Refund failed' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Refund error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Wallet deduction and transaction logging
app.post('/api/update-wallet', async (req, res) => {
  const { userId, amount, transaction } = req.body;

  try {
    // 1. Get current user balance and history
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('wallet_balance, history')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      console.error('User fetch error:', fetchError);
      return res.status(400).json({ error: 'User not found' });
    }

    // 2. Check for sufficient balance
    if (user.wallet_balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const newBalance = user.wallet_balance - amount;
    const history = user.history || [];
    history.push(transaction);

    // 3. Update wallet and history
    const { error: updateError } = await supabase
      .from('users')
      .update({
        wallet_balance: newBalance,
        history
      })
      .eq('id', userId);

    if (updateError) {
      console.error("Wallet update failed:", updateError);
      return res.status(500).json({ error: 'Failed to update wallet' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ BizzyBills proxy running: http://localhost:${PORT}`);
});
