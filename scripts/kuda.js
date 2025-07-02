// scripts/kuda.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://xhuyzhlutarpffhdwbni.supabase.co',
  'your_supabase_service_key_here'
);

const KUDA_BASE_URL = 'https://kuda-openapi.kuda.com/v1';
const KUDA_API_KEY = 'YOUR_KUDA_API_KEY';
const KUDA_EMAIL = 'your_business_email@domain.com';

export async function createKudaVirtualAccount({ full_name, phone, email, userId }) {
  const payload = {
    serviceType: "ADMIN_CREATE_VIRTUAL_ACCOUNT",
    requestRef: `user-${userId}-${Date.now()}`,
    data: {
      email,
      firstName: full_name.split(' ')[0],
      lastName: full_name.split(' ')[1] || '',
      phoneNumber: phone
    }
  };

  try {
    const response = await fetch(KUDA_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KUDA_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!result || !result.data || !result.data.accountNumber) {
      console.error('Kuda account creation failed:', result);
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
    console.error('Error creating Kuda account:', err.message);
  }
}
