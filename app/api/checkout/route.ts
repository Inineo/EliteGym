import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const PLAN_DETAILS: Record<string, { name: string; price: number; isPT: boolean }> = {
  'Single': { name: 'Single Package', price: 1200000, isPT: false },
  'Couple': { name: 'Couple Package', price: 2000000, isPT: false },
  'Team 4': { name: 'Team 4 Package', price: 3500000, isPT: false },
  'Single PT (Session)': { name: 'Single PT Package', price: 850000, isPT: true },
  'Couple PT (Session)': { name: 'Couple PT Package', price: 1400000, isPT: true },
  'Team PT (Session)': { name: 'Team PT Package', price: 2400000, isPT: true }
};

// Whitelist kode promo resmi server-side (mencegah price tampering)
const VALID_PROMOS: Record<string, { discount: number; label: string }> = {
  'ELITE2024': { discount: 200000, label: 'Diskon Member Baru Rp 200.000' },
  'ELITEFIT': { discount: 150000, label: 'Diskon Komunitas Rp 150.000' }
};

export async function POST(request: NextRequest) {
  try {
    // 1. Verifikasi autentikasi user via Bearer token
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Sesi login diperlukan untuk melakukan checkout.' },
        { status: 401 }
      );
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Sesi tidak valid atau telah kedaluwarsa.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planName, promoCode, paymentMethod } = body;

    // 2. Validasi paket resmi (Server-authoritative pricing)
    const plan = PLAN_DETAILS[planName];
    if (!plan) {
      return NextResponse.json(
        { error: `Paket '${planName}' tidak ditemukan.` },
        { status: 400 }
      );
    }

    // 3. Validasi promo code server-side
    let discount = 0;
    if (promoCode) {
      const sanitizedCode = String(promoCode).trim().toUpperCase();
      if (VALID_PROMOS[sanitizedCode]) {
        discount = VALID_PROMOS[sanitizedCode].discount;
      } else {
        return NextResponse.json(
          { error: `Kode promo '${promoCode}' tidak valid atau sudah kedaluwarsa.` },
          { status: 400 }
        );
      }
    }

    // 4. Kalkulasi harga presisi di server
    const subtotal = plan.price;
    const tax = Math.round(subtotal * 0.1);
    const totalDue = Math.max(0, (subtotal + tax) - discount);

    const orderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 5. Catat status order 'pending'
    try {
      const dbClient = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : authClient;
      await dbClient.from('orders').insert({
        id: orderId,
        user_id: user.id,
        item_type: plan.isPT ? 'trainer_package' : 'membership',
        gross_amount: totalDue,
        total_amount: totalDue,
        status: 'pending',
        payment_type: paymentMethod || 'bank_transfer'
      });
    } catch (dbErr) {
      console.warn('Order DB insert fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      orderId,
      subtotal,
      tax,
      discount,
      totalDue,
      planName: plan.name,
      mode: 'dummy_simulation'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
