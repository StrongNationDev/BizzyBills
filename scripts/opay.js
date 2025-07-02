// scripts/opay.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://xhuyzhlutarpffhdwbni.supabase.co',
  'your_supabase_service_key_here'
);

export async function createOpayVirtualAccount({ full_name, phone, email, userId }) {
  try {
    const response = await fetch('https://sandboxapi.opaycheckout.com/api/v3/virtual-account', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_OPAY_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        country: 'NG',
        customerPhone: phone,
        customerEmail: email,
        customerName: full_name,
        reference: `user-${userId}-${Date.now()}`
      })
    });

    const result = await response.json();

    if (!result || !result.data || !result.data.accountNumber) {
      console.error('OPay account creation failed:', result);
      return;
    }

    const accountNumber = result.data.accountNumber;

    // Update Supabase user with account number
    const { error } = await supabase
      .from('users')
      .update({ account_number: accountNumber })
      .eq('id', userId);

    if (error) {
      console.error('Failed to update Supabase:', error.message);
    }
  } catch (err) {
    console.error('Error creating OPay account:', err.message);
  }
}
