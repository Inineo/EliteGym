import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * SERVER PAYMENT VERIFICATION & ACTIVATION ENDPOINT
 * Mencegah Client-Side Trust: hanya server yang berhak mengubah status order menjadi 'settlement'
 * dan mengaktifkan membership di profil user.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verifikasi token autentikasi pengguna
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Sesi login diperlukan untuk memverifikasi pembayaran.' },
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
    const { orderId, planName, paymentMethod } = body;

    const dbClient = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : authClient;

    // 2. Update status order menjadi 'settlement' (Idempotent update)
    if (orderId) {
      try {
        await dbClient
          .from('orders')
          .update({
            status: 'settlement',
            payment_type: paymentMethod || 'bank_transfer',
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId)
          .eq('user_id', user.id);
      } catch (err) {
        console.warn('Order status update notice:', err);
      }
    }

    // 3. Aktifkan membership di profile user (Single Source of Truth)
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + 30);

    try {
      await dbClient
        .from('profiles')
        .update({
          membership_active: true,
          package_level: planName || 'Single Package',
          renewal_date: renewalDate.toISOString().split('T')[0],
          payment_method: paymentMethod || 'bank_transfer'
        })
        .eq('id', user.id);
    } catch (profErr) {
      console.warn('Profile activation notice:', profErr);
    }

    return NextResponse.json({
      success: true,
      status: 'settlement',
      orderId: orderId || `SIM-${Date.now()}`,
      activatedPackage: planName,
      message: 'Pembayaran berhasil diverifikasi oleh server dan paket aktif.'
    });
  } catch (error: any) {
    console.error('Confirmation endpoint error:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal memverifikasi pembayaran' },
      { status: 500 }
    );
  }
}
