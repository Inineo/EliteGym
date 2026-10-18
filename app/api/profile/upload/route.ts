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

    // 2. Validasi token ke Supabase Auth
    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or expired session' },
        { status: 401 }
      );
    }

    // 3. Ambil file dari FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // 4. Validasi tipe MIME dan ekstensi file
    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['jpeg', 'jpg', 'png', 'webp'];

    if (!validMimes.includes(file.type) || !ext || !validExts.includes(ext)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // 5. Validasi ukuran file (maksimal 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // 6. Generate filename aman yang terikat dengan user.id terverifikasi (IDOR protected)
    const normalizedExt = ext === 'jpg' ? 'jpeg' : ext;
    const fileName = `${user.id}-${Date.now()}.${normalizedExt}`;
    const filePath = `avatars/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const storageClient = supabaseServiceKey 
      ? createClient(supabaseUrl, supabaseServiceKey) 
      : authClient;

    // Upload ke Supabase Storage bucket 'profiles'
    const { error: uploadError } = await storageClient.storage
      .from('profiles')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file: ' + uploadError.message },
        { status: 500 }
      );
    }

    // Dapatkan Public URL
    const { data: publicUrlData } = storageClient.storage
      .from('profiles')
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    // Update avatar_url di tabel profiles
    const { error: updateError } = await storageClient
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile: ' + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      avatarUrl,
      message: 'Profile picture updated successfully',
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
