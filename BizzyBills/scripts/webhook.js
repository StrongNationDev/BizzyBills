const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Supabase config
const supabaseUrl = 'https://xhuyzhlutarpffhdwbni.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTYwMzQ0NiwiZXhwIjoyMDY1MTc5NDQ2fQ.7Er7cDba8jM39v_NNtibxPl_rn9jLOqRahEr3R1hbGk';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// PaymentPoint secret
const PAYMENTPOINT_SECRET = '60c2d0ce952457f05d8c6b862252fa761e0c52e35f89469a0c284e9d271f5be670ba1e422709f2ec2b38f80e792b2554b16b284c48be429dba3891f7';

app.post('/webhook', async (req, res) => {
  try {
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['paymentpoint-signature'];

    if (!signature) {
      return res.status(400).send('Missing signature header');
    }

    const expectedSignature = crypto
      .createHmac('sha256', PAYMENTPOINT_SECRET)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).send('Invalid signature');
    }

    const {
      notification_status,
      transaction_id,
      amount_paid,
      receiver,
      timestamp
    } = req.body;

    if (notification_status !== 'payment_successful') {
      return res.status(200).send('Ignored: Not a successful payment');
    }

    const account_number = receiver?.account_number;
    if (!account_number || !amount_paid || !transaction_id) {
      return res.status(400).send('Missing required fields');
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('account_number', account_number)
      .single();

    if (userError || !user) {
      console.error('❌ User not found:', account_number);
      return res.status(404).send('User not found');
    }

    const flatCharge = 15;
    const paidAmount = Number(amount_paid);
    const netAmount = Math.max(paidAmount - flatCharge, 0);

    const updatedBalance = (user.wallet_balance || 0) + netAmount;

    const newHistoryItem = {
      type: 'deposit',
      amount: netAmount,
      original_amount: paidAmount,
      charge_amount: flatCharge,
      description: 'Payment via virtual account',
      timestamp,
      transaction_id
    };

    const updatedHistory = [...(user.history || []), newHistoryItem];

    const { error: updateError } = await supabase
      .from('users')
      .update({
        wallet_balance: updatedBalance,
        history: updatedHistory
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ Failed to update user:', updateError.message);
      return res.status(500).send('Update failed');
    }

    console.log(`✅ Webhook processed for user ${user.id}, +₦${netAmount}`);
    return res.status(200).send('Webhook processed successfully');

  } catch (error) {
    console.error('🔥 Webhook error:', error.message);
    return res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running at http://localhost:${PORT}`);
});
