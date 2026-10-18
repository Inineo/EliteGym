import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    // 1. Verifikasi header Authorization (Bearer token)
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid authorization token' },
        { status: 401 }
      );
    }

    // 2. Validasi token ke Supabase Auth untuk mendapatkan identitas user asli
    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or expired session' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, bio } = body;

    // 3. Sanitasi input fields
    const updateData: Record<string, string> = {};
    if (typeof name === 'string') updateData.name = name.trim();
    if (typeof phone === 'string') updateData.phone = phone.trim();
    if (typeof bio === 'string') updateData.bio = bio.trim();

    // 4. Update data profil hanya untuk user yang terautentikasi (IDOR protected)
    const dbClient = supabaseServiceKey 
      ? createClient(supabaseUrl, supabaseServiceKey) 
      : authClient;

    const { data, error } = await dbClient
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
