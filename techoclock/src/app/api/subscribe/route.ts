import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.KIT_API_KEY;

    // Step 1 — Create or find the subscriber
    const res = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Kit-Api-Key': apiKey!,
      },
      body: JSON.stringify({
        email_address: email,
        state: 'active',
      }),
    });

    const data = await res.json();
    console.log('Kit response status:', res.status);
    console.log('Kit response:', JSON.stringify(data));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.errors?.[0] || 'Subscription failed' },
        { status: 400 }
      );
    }

    // Step 2 — Tag them as "website" subscribers
    const subscriberId = data.subscriber?.id;
    if (subscriberId) {
      await fetch(`https://api.kit.com/v4/forms/${process.env.KIT_FORM_ID}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Kit-Api-Key': apiKey!,
        },
        body: JSON.stringify({ id: subscriberId }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
