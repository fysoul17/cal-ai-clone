import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Use admin client for cron
import { confirmBillingPayment } from '@/lib/tosspayments';
import { v4 as uuidv4 } from 'uuid';

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Use Service Role Key to bypass RLS and access all subscriptions
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Find subscriptions due for payment
    // simple logic: next_payment_at <= now AND status = 'ACTIVE'
    const now = new Date().toISOString();
    const { data: subscriptions, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*, user:auth.users(email)')
      .eq('status', 'ACTIVE')
      .lte('next_payment_at', now);

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No subscriptions due' });
    }

    const results = [];

    for (const sub of subscriptions) {
      try {
        const orderId = uuidv4();
        // 2. Request Payment
        await confirmBillingPayment(sub.billing_key, {
          amount: sub.amount,
          customerKey: sub.customer_key,
          orderId: orderId,
          orderName: 'Monthly Subscription',
          customerEmail: sub.user?.email,
        });

        // 3. Update Subscription (next_payment_at + 30 days)
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 30);

        await supabaseAdmin
          .from('subscriptions')
          .update({
            last_payment_at: new Date().toISOString(),
            next_payment_at: nextDate.toISOString(),
          })
          .eq('id', sub.id);

        results.push({ id: sub.id, status: 'SUCCESS', orderId });

        // Optionally insert into a 'payments' or 'transactions' table
      } catch (payError: any) {
        results.push({ id: sub.id, status: 'FAILED', message: payError.message });
      }
    }

    return NextResponse.json({ results });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
