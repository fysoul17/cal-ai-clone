import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { issueBillingKey } from '@/lib/tosspayments';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const authKey = searchParams.get('authKey');
  const customerKey = searchParams.get('customerKey');
  const code = searchParams.get('code');
  const message = searchParams.get('message');

  // Handle error case from TossPayments redirect
  if (code) {
    const safeCode = encodeURIComponent(code);
    const safeMessage = encodeURIComponent(message || '');
    return NextResponse.redirect(
      new URL(`/subscription/fail?code=${safeCode}&message=${safeMessage}`, request.url)
    );
  }

  if (!authKey || !customerKey) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Issue Billing Key
    const billingData = await issueBillingKey(authKey, customerKey);
    // billingData has: billingKey, card (issuerCode, acquirerCode, number, cardType, ownerType), authenticatedAt, etc.

    // 2. Save to Database
    const { error: dbError } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      customer_key: customerKey,
      billing_key: billingData.billingKey,
      card_company: billingData.card?.company || billingData.cardCompany,
      card_number: billingData.card?.number || billingData.cardNumber,
      amount: 9900, // Monthly subscription price (example)
      currency: 'KRW',
      status: 'ACTIVE',
      next_payment_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days (simplified)
      last_payment_at: new Date().toISOString(), // Assuming we charge immediately or mark as started
    });

    if (dbError) {
      return NextResponse.redirect(
        new URL(`/subscription/fail?code=DB_ERROR&message=Failed to save subscription`, request.url)
      );
    }

    // 3. (Optional) Initial Charge could happen here or we just start the cycle.
    // For this example, we'll assume the cycle starts now and we might charge immediately via a separate call 
    // or just rely on the Scheduler. common pattern is charge immediately.
    // Let's redirect to success for now.

    return NextResponse.redirect(new URL('/subscription/success', request.url));

  } catch (error: any) {
    const errorCode = encodeURIComponent(error.code || 'UNKNOWN');
    const errorMessage = encodeURIComponent(error.message || 'An error occurred');
    return NextResponse.redirect(
      new URL(`/subscription/fail?code=${errorCode}&message=${errorMessage}`, request.url)
    );
  }
}
