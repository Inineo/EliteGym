import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      transaction_status,
      payment_type,
      signature_key,
      transaction_id
    } = body;

    // 1. Verifikasi Signature Key untuk keamanan webhook
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const hashSource = order_id + status_code + gross_amount + serverKey;
    const generatedSignature = crypto.createHash('sha512').update(hashSource).digest('hex');

    // Pastikan webhook berasal dari Midtrans asli
    if (serverKey && generatedSignature !== signature_key) {
      return NextResponse.json({ error: 'Invalid signature key.' }, { status: 403 });
    }

    console.log(`Webhook received for order ${order_id}: status=${transaction_status}`);

    // 2. Tentukan status transaksi
    let finalStatus = 'pending';
    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      finalStatus = 'settlement';
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'cancel' ||
      transaction_status === 'expire'
    ) {
      finalStatus = transaction_status;
    }

    // 3. Update tabel orders di Supabase
    const { data: updatedOrder, error: updateOrderError } = await supabase
      .from('orders')
      .update({
        status: finalStatus,
        payment_type: payment_type,
        midtrans_transaction_id: transaction_id,
        raw_notification: body
      })
      .eq('id', order_id)
      .select()
      .single();

    if (updateOrderError) {
      console.error('Failed to update order in database:', updateOrderError);
      return NextResponse.json({ error: 'Order update failed.' }, { status: 500 });
    }

    // 4. Jika transaksi berhasil (settlement), aktifkan paket/layanan
    if (finalStatus === 'settlement' && updatedOrder) {
      const { user_id, item_type, item_id } = updatedOrder;

      if (item_type === 'membership') {
        // Hitung masa berlaku paket (30 hari)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        // Masukkan data ke tabel memberships
        const { error: memError } = await supabase
          .from('memberships')
          .insert({
            user_id: user_id,
            package_id: item_id,
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            payment_method: payment_type
          });

        if (memError) {
          console.error('Failed to activate membership:', memError);
          return NextResponse.json({ error: 'Failed to activate membership.' }, { status: 500 });
        }
      } else if (item_type === 'trainer_package') {
        // Ambil jumlah sesi dari master trainer_packages
        const { data: pkgData } = await supabase
          .from('trainer_packages')
          .select('session_count')
          .eq('id', item_id)
          .single();

        const sessionsToAdd = pkgData ? pkgData.session_count : 1;

        // Cek apakah user sudah memiliki saldo sesi PT sebelumnya
        const { data: existingSessions } = await supabase
          .from('user_trainer_sessions')
          .select('id, remaining_sessions, total_sessions')
          .eq('user_id', user_id)
          .eq('trainer_package_id', item_id)
          .single();

        if (existingSessions) {
          // Update saldo sesi
          await supabase
            .from('user_trainer_sessions')
            .update({
              total_sessions: existingSessions.total_sessions + sessionsToAdd,
              remaining_sessions: existingSessions.remaining_sessions + sessionsToAdd
            })
            .eq('id', existingSessions.id);
        } else {
          // Buat saldo sesi baru
          await supabase
            .from('user_trainer_sessions')
            .insert({
              user_id: user_id,
              trainer_package_id: item_id,
              total_sessions: sessionsToAdd,
              remaining_sessions: sessionsToAdd
            });
        }
      }
    }

    return NextResponse.json({ success: true, status: finalStatus });

  } catch (error: any) {
    console.error('Webhook error handler:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
