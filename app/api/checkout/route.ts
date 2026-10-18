import { NextResponse } from 'next/server';

const PLAN_DETAILS: Record<string, { name: string; price: number; isPT: boolean }> = {
  'Single': { name: 'Single Package', price: 1200000, isPT: false },
  'Couple': { name: 'Couple Package', price: 2000000, isPT: false },
  'Team 4': { name: 'Team 4 Package', price: 3500000, isPT: false },
  'Single PT (Session)': { name: 'Single PT Package', price: 850000, isPT: true },
  'Couple PT (Session)': { name: 'Couple PT Package', price: 1400000, isPT: true },
  'Team PT (Session)': { name: 'Team PT Package', price: 2400000, isPT: true }
};

/**
 * DUMMY CHECKOUT API
 * Beroperasi dalam mode simulasi/dummy.
 * Siap dihubungkan ke Midtrans Snap SDK saat production keys sudah diisi.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planName, promoCode } = body;

    const plan = PLAN_DETAILS[planName] || PLAN_DETAILS['Single'];
    const subtotal = plan.price;
    const tax = Math.round(subtotal * 0.1);
    const discount = promoCode ? 200000 : 0;
    const totalDue = (subtotal + tax) - discount;

    const orderId = `DUMMY-ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    /*
     * ========================================================
     * [INTEGRASI MIDTRANS DI MASA DEPAN]
     * Saat serverKey dan clientKey sudah tersedia, aktifkan blok ini:
     *
     * import MidtransClient from 'midtrans-client';
     * const snap = new MidtransClient.Snap({
     *   isProduction: process.env.NODE_ENV === 'production',
     *   serverKey: process.env.MIDTRANS_SERVER_KEY,
     *   clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
     * });
     * const transaction = await snap.createTransaction({
     *   transaction_details: { order_id: orderId, gross_amount: totalDue },
     *   customer_details: { email: userEmail, first_name: userName },
     * });
     * const snapToken = transaction.token;
     * ========================================================
     */

    return NextResponse.json({
      success: true,
      orderId,
      totalDue,
      snapToken: null,
      mode: 'dummy_simulation'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
