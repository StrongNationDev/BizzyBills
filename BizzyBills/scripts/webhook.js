// server/webhookHandler.js (Node.js backend)
import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 4000; // Your server port

const supabase = createClient(
  'https://xhuyzhlutarpffhdwbni.supabase.co',
  'YOUR_SUPABASE_SERVICE_ROLE_KEY'
);

app.use(bodyParser.json());

app.post('/webhook/funding', async (req, res) => {
  const payload = req.body;

  const {
    amount,
    accountNumber,
    reference,
    narration,
    customerName
  } = payload;

  if (!accountNumber || !amount) {
    return res.status(400).send('Missing required data');
  }

  // Get user with this account number
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('account_number', accountNumber)
    .single();

  if (error || !user) {
    return res.status(404).send('User not found');
  }

  // Validate minimum amount
  if (amount < 1000) {
    return res.status(400).send('Amount below minimum allowed');
  }

  const charge = 10;
  const amountToCredit = amount - charge;

  const newBalance = (user.wallet_balance || 0) + amountToCredit;

  // Update user's wallet balance and add to history
  const historyItem = {
    type: 'funding',
    amount: amount,
    credited: amountToCredit,
    charge,
    timestamp: new Date().toISOString(),
    reference,
    narration
  };

  const { error: updateError } = await supabase
    .from('users')
    .update({
      wallet_balance: newBalance,
      history: [...(user.history || []), historyItem]
    })
    .eq('id', user.id);

  if (updateError) {
    return res.status(500).send('Failed to update balance');
  }

  return res.status(200).send('Wallet credited');
});

app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));
