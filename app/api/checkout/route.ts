import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
// @ts-ignore
import MidtransClient from 'midtrans-client';

const PLAN_DETAILS: Record<string, { name: string; price: number; isPT: boolean }> = {
  'Single': { name: 'Single Package', price: 1200000, isPT: false },
  'Couple': { name: 'Couple Package', price: 2000000, isPT: false },
  'Team 4': { name: 'Team 4 Package', price: 3500000, isPT: false },
  'Single PT (Session)': { name: 'Single PT Package', price: 850000, isPT: true },
  'Couple PT (Session)': { name: 'Couple PT Package', price: 1400000, isPT: true },
  'Team PT (Session)': { name: 'Team PT Package', price: 2400000, isPT: true }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planName, userId, userEmail, userName, userPhone, promoCode } = body;

    if (!planName || !userId) {
      return NextResponse.json({ error: 'planName and userId are required.' }, { status: 400 });
    }

    const plan = PLAN_DETAILS[planName];
    if (!plan) {
      return NextResponse.json({ error: `Plan ${planName} not found.` }, { status: 404 });
    }

    // 1. Hitung harga (PPN 10%)
    let subtotal = plan.price;
    const tax = Math.round(subtotal * 0.1);
    let discount = 0;

    // Diskon promo statis jika memasukkan promo
    if (promoCode) {
      discount = 200000; // Diskon Rp 200.000
    }

    const totalDue = (subtotal + tax) - discount;

    // 2. Query Item ID (UUID) dari Supabase sesuai jenis paket
    let itemId = '00000000-0000-0000-0000-000000000000'; // Default fallback UUID
    
    if (plan.isPT) {
      const { data } = await supabase
        .from('trainer_packages')
        .select('id')
        .eq('name', planName)
        .single();
      if (data) itemId = data.id;
    } else {
      const { data } = await supabase
        .from('membership_packages')
        .select('id')
        .eq('name', planName)
        .single();
      if (data) itemId = data.id;
    }

    // 3. Inisialisasi Midtrans Snap SDK
    const snap = new MidtransClient.Snap({
      isProduction: false, // Sandbox
      serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-DummyKey123',
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-DummyKey123'
    });

    const orderId = `ORD-EF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Buat Parameter Transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalDue
      },
      customer_details: {
        first_name: userName || 'Gym Member',
        email: userEmail || 'member@elitefitness.com',
        phone: userPhone || ''
      },
      item_details: [
        {
          id: plan.isPT ? 'PT-PKG' : 'MEM-PKG',
          price: subtotal + tax,
          quantity: 1,
          name: plan.name
        },
        ...(discount > 0 ? [{
          id: 'PROMO-DISC',
          price: -discount,
          quantity: 1,
          name: 'Promo Discount'
        }] : [])
      ]
    };

    // 5. Mintakan Token SNAP dari Midtrans
    let snapToken = '';
    let redirectUrl = '';
    try {
      const transaction = await snap.createTransaction(parameter);
      snapToken = transaction.token;
      redirectUrl = transaction.redirect_url;
    } catch (midError: any) {
      console.error('Error generating Midtrans SNAP token:', midError);
      // Fallback token simulasi jika Midtrans Server Key belum dimasukkan oleh pengguna
      snapToken = `mock_snap_token_${Math.random().toString(36).substring(7)}`;
    }

    // 6. Simpan transaksi ke database Supabase
    const { error: dbError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: userId,
        item_type: plan.isPT ? 'trainer_package' : 'membership',
        item_id: itemId,
        gross_amount: totalDue,
        status: 'pending',
        snap_token: snapToken
      });

    if (dbError) {
      console.error('Database error storing order:', dbError);
      // Tetap lanjutkan dan beri kembalian token demi kelancaran flow
    }

    return NextResponse.json({
      orderId,
      snapToken,
      redirectUrl,
      totalDue
    });

  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
