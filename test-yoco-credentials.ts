// Test Yoco credentials directly with detailed environment variable checking
async function testYocoCredentials() {
  console.log('=== Yoco Credentials Test ===\n');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log('- YOCO_SECRET_KEY:', process.env.YOCO_SECRET_KEY ? 
    `${process.env.YOCO_SECRET_KEY.substring(0, 10)}... (${process.env.YOCO_SECRET_KEY.length} chars)` : 
    'NOT SET');
  console.log('- NEXT_PUBLIC_YOCO_PUBLIC_KEY:', process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY ? 
    `${process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY.substring(0, 10)}... (${process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY.length} chars)` : 
    'NOT SET');
  console.log('- PAYMENT_TEST_MODE:', process.env.PAYMENT_TEST_MODE || 'NOT SET');
  
  const SECRET_KEY = process.env.YOCO_SECRET_KEY;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY;
  
  if (!SECRET_KEY || !PUBLIC_KEY) {
    console.log('\n❌ Missing required environment variables!');
    console.log('Please set YOCO_SECRET_KEY and NEXT_PUBLIC_YOCO_PUBLIC_KEY');
    return;
  }
  
  console.log('\n--- Test 1: Authentication Check ---');
  try {
    const authResponse = await fetch('https://api.yoco.com/online/v1/checkouts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Auth check status:', authResponse.status);
    console.log('Auth check status text:', authResponse.statusText);
    
    if (authResponse.status === 401) {
      console.log('❌ Authentication failed - 401 Unauthorized');
      const errorText = await authResponse.text();
      console.log('Error details:', errorText);
    } else if (authResponse.ok) {
      console.log('✅ Authentication successful');
    } else {
      console.log('⚠️ Unexpected response:', authResponse.status);
      const errorText = await authResponse.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.log('❌ Authentication test failed with error:', error);
  }
  
  console.log('\n--- Test 2: Create Minimal Checkout ---');
  try {
    const checkoutResponse = await fetch('https://api.yoco.com/online/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
      },
      body: JSON.stringify({
        amount: 100, // 1 ZAR in cents
        currency: 'ZAR',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      })
    });
    
    console.log('Checkout creation status:', checkoutResponse.status);
    console.log('Checkout creation status text:', checkoutResponse.statusText);
    
    if (checkoutResponse.ok) {
      const result = await checkoutResponse.json();
      console.log('✅ Checkout creation successful');
      console.log('Checkout URL:', result.checkoutUrl);
    } else {
      console.log('❌ Checkout creation failed');
      const errorText = await checkoutResponse.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.log('❌ Checkout creation test failed with error:', error);
  }
  
  console.log('\n=== Test Complete ===');
}

// Run the test
testYocoCredentials().catch(console.error);