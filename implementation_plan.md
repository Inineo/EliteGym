# Rencana Implementasi Integrasi Supabase & Midtrans

Rencana ini menjelaskan bagaimana menghubungkan aplikasi frontend Next.js Elite Fitness dengan database Supabase (Autentikasi, Profil, Keanggotaan, Check-in) dan Midtrans Payment Gateway.

---

## Proposed Changes

### 1. Dependencies & Environment
Kita perlu menginstal library resmi `@supabase/supabase-js` untuk interaksi database, dan `midtrans-client` untuk integrasi backend Midtrans SDK.

#### [NEW] [.env.example](file:///e:/Web/elite-fitness-next/.env.example)
Membuat file template env agar pengguna tahu key apa saja yang harus dimasukkan.
*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
*   `MIDTRANS_SERVER_KEY`
*   `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`

---

### 2. Supabase Client Setup
Kita akan membuat inisialisasi client Supabase yang aman untuk diakses di sisi klien Next.js.

#### [NEW] [lib/supabase.ts](file:///e:/Web/elite-fitness-next/lib/supabase.ts)
Membuat instansi `supabaseClient` menggunakan variabel lingkungan untuk melakukan query tabel public dan interaksi Auth.

---

### 3. API Routes (Backend)

#### [NEW] [app/api/checkout/route.ts](file:///e:/Web/elite-fitness-next/app/api/checkout/route.ts)
Endpoint API Route Next.js untuk membuat transaksi pembayaran ke Midtrans.
*   Menerima ID paket keanggotaan/PT, data user dari frontend.
*   Melakukan validasi harga paket di database.
*   Membuat transaksi ke Midtrans menggunakan SNAP SDK.
*   Menyimpan transaksi awal di tabel `orders` Supabase dengan status `pending`.
*   Mengembalikan `snap_token` ke frontend.

#### [NEW] [app/api/webhooks/midtrans/route.ts](file:///e:/Web/api/webhooks/midtrans/route.ts)
Endpoint API Route Next.js asinkron yang dipanggil oleh Midtrans Webhook Notification.
*   Menerima status transaksi terbaru dari Midtrans (`settlement`, `expire`, `cancel`, `deny`).
*   Melakukan verifikasi signature key dari payload Midtrans untuk keamanan.
*   Memperbarui status transaksi di tabel `orders`.
*   Jika transaksi sukses (`settlement`), mengaktifkan keanggotaan di tabel `memberships` (atau menambah saldo sesi PT di tabel `user_trainer_sessions`).

---

### 4. Client Pages & Components Integration
Kita perlu memodifikasi mockup frontend agar melakukan panggilan API / Supabase nyata.

#### [MODIFY] [app/page.tsx](file:///e:/Web/elite-fitness-next/app/page.tsx)
*   Mengubah handler login/register menggunakan Supabase Auth client (`supabase.auth.signInWithPassword` dan `signUp`).
*   Mengambil data profil pengguna nyata dari tabel `profiles` setelah login.
*   Menghubungkan tombol check-in untuk menulis log ke tabel `check_ins` Supabase.

#### [MODIFY] [app/checkout/page.tsx](file:///e:/Web/elite-fitness-next/app/checkout/page.tsx)
*   Memasukkan script Midtrans SNAP (`https://app.sandbox.midtrans.com/snap/snap.js` atau production) secara dinamis.
*   Memanggil API route `/api/checkout` untuk mendapatkan token SNAP nyata.
*   Memicu overlay UI Midtrans SNAP untuk penyelesaian transaksi oleh pengguna.

#### [MODIFY] [components/ProfileView.tsx](file:///e:/Web/elite-fitness-next/components/ProfileView.tsx)
*   Mengintegrasikan fungsionalitas check-in riil dengan menyisipkan baris baru di tabel `check_ins` Supabase.
*   Memperbarui nilai *streak* dan kunjungan pengguna secara dinamis dari database.

---

## Verification Plan

### Manual Verification
1.  **Registrasi & Login**: Pastikan user baru terbuat di Supabase Auth dan secara otomatis membuat data baris baru di tabel `profiles` via PostgreSQL trigger.
2.  **Checkout & Midtrans SNAP**: Klik tombol "Purchase" pada paket, panggil endpoint backend, pastikan window SNAP Midtrans terbuka dengan nominal yang benar.
3.  **Simulasi Webhook**: Jalankan simulasi pembayaran sukses di dashboard sandbox Midtrans, verifikasi webhook mengubah status `orders` menjadi `settlement` dan mengaktifkan keanggotaan di tabel `memberships`.
4.  **Check-in**: Klik tombol "Check-in" di profil, pastikan data tersimpan di tabel `check_ins` dan total kunjungan serta streak di profil bertambah.
