const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = 'https://xhuyzhlutarpffhdwbni.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXl6aGx1dGFycGZmaGR3Ym5pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTYwMzQ0NiwiZXhwIjoyMDY1MTc5NDQ2fQ.7Er7cDba8jM39v_NNtibxPl_rn9jLOqRahEr3R1hbGk';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const API_SECRET = 'Bearer 60c2d0ce952457f05d8c6b862252fa761e0c52e35f89469a0c284e9d271f5be670ba1e422709f2ec2b38f80e792b2554b16b284c48be429dba3891f7';
const API_KEY = 'a137408f0915f13fc922bbb75a678cb5345c8ad0';
const BUSINESS_ID = 'bd5c47afecef6c42c81e4760ca960b71c16d6783';
const BANK_CODE = ['20946']; 

app.post('/api/createVirtualAccount', async (req, res) => {
  const { id, name, email, phoneNumber } = req.body;

  if (!id || !name || !email || !phoneNumber) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields: id, name, email, phoneNumber'
    });
  }

  try {
    console.log("📥 Incoming ID:", id);
    console.log("📥 Incoming Email:", email);

    const { data: foundUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !foundUser) {
      console.error("❌ User fetch failed:", fetchError?.message || 'User not found');
      return res.status(404).json({
        status: 'error',
        message: 'No user found with provided ID'
      });
    }

    console.log("✅ User found:", foundUser);

    const apiResponse = await axios.post(
      'https://api.paymentpoint.co/api/v1/createVirtualAccount',
      {
        email,
        name,
        phoneNumber,
        bankCode: BANK_CODE,
        businessId: BUSINESS_ID
      },
      {
        headers: {
          Authorization: API_SECRET,
          'Content-Type': 'application/json',
          'api-key': API_KEY
        }
      }
    );

    const result = apiResponse.data;
    const bankAccount = result.bankAccounts?.[0];

    if (!bankAccount?.accountNumber) {
      return res.status(500).json({
        status: 'error',
        message: 'Virtual account created, but no account number returned'
      });
    }

    const accountNumber = bankAccount.accountNumber;
    const bankName = bankAccount.bankName || 'PaymentPoint Bank';

    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update({
        account_number: accountNumber,
      })
      .eq('id', id)
      .select('id, account_number');

    if (updateError) {
      console.error("❌ Supabase update failed:", updateError.message);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update account number in Supabase',
        supabaseError: updateError.message
      });
    }

    if (!updated.length || !updated[0].account_number) {
      console.warn('⚠️ Update ran, but account_number is still empty');
      return res.status(500).json({
        status: 'error',
        message: 'Update completed but account_number is still missing.'
      });
    }

    console.log("✅ Update success:", updated[0]);

    const { data: verifyUser } = await supabase
      .from('users')
      .select('id, account_number')
      .eq('id', id)
      .single();

    console.log("🔁 Verified updated user:", verifyUser);

    return res.status(200).json({
      status: 'success',
      message: 'Virtual account created and user updated',
      bankAccounts: result.bankAccounts,
      updatedUser: verifyUser
    });

  } catch (err) {
    console.error('❌ Server error:', err.response?.data || err.message);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong while creating the virtual account.',
      error: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

