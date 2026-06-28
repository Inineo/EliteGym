# 📊 Database & Storage Tracking Log

> **⚠️ PENTING**: File ini adalah **single source of truth** untuk semua database tables, storage buckets, dan schema di project Elite Fitness. **WAJIB UPDATE** setiap kali ada perubahan!

**Last Updated**: 2026-06-28  
**Project**: Elite Fitness Next.js  
**Database**: Supabase PostgreSQL

---

## 🎯 Cara Menggunakan Dokumen Ini

### ✅ Setiap kali membuat/mengubah database:
1. Update section yang relevan
2. Update "Last Updated" di atas
3. Tambahkan entry di **Changelog** (bawah dokumen)
4. Commit changes dengan pesan jelas

### ✅ Sebelum development baru:
1. Baca dokumen ini untuk memahami struktur existing
2. Check apakah table/column yang dibutuhkan sudah ada
3. Jika belum ada, tambahkan di section yang tepat

---

## 📋 Database Tables

### 1. `profiles` ✅ Active

**Purpose**: Menyimpan data profile user/member gym

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, REFERENCES auth.users(id) | User ID dari Supabase Auth |
| `name` | TEXT | NOT NULL | Nama lengkap user |
| `email` | TEXT | NOT NULL | Email user |
| `phone` | TEXT | NULLABLE | Nomor telepon |
| `bio` | TEXT | NULLABLE | Bio/subtitle user |
| `avatar_url` | TEXT | NULLABLE | Public URL ke profile picture |
| `member_id` | TEXT | UNIQUE, NULLABLE | Member ID unik (e.g., ELITE-000123) |
| `joined_year` | INTEGER | DEFAULT EXTRACT(YEAR FROM NOW()) | Tahun bergabung |
| `membership_active` | BOOLEAN | DEFAULT true | Status membership |
| `package_level` | TEXT | NULLABLE | Nama package (e.g., "Elite Pro") |
| `renewal_date` | DATE | NULLABLE | Tanggal renewal membership |
| `payment_method` | TEXT | NULLABLE | Metode pembayaran |
| `current_progress_days` | INTEGER | DEFAULT 0 | Progress hari di cycle |
| `total_days_in_cycle` | INTEGER | DEFAULT 30 | Total hari dalam cycle |
| `total_visits` | INTEGER | DEFAULT 0 | Total kunjungan gym |
| `last_check_in` | TIMESTAMP WITH TIME ZONE | NULLABLE | Waktu check-in terakhir |
| `best_streak` | INTEGER | DEFAULT 0 | Best streak hari berturut-turut |
| `current_streak` | INTEGER | DEFAULT 0 | Current streak |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Waktu dibuat |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Waktu terakhir diupdate |

**Indexes**:
- `idx_profiles_email` on `email`
- `idx_profiles_member_id` on `member_id`

**Triggers**:
- `update_profiles_updated_at` - Auto-update `updated_at` on UPDATE

**RLS Policies**:
- ✅ Enabled
- Users can view own profile
- Users can update own profile
- Users can insert own profile

**Related API Endpoints**:
- `POST /api/profile/upload` - Upload avatar
- `POST /api/profile/update` - Update profile data

**Last Modified**: 2026-06-28

---

### 2. `check_ins` ✅ Active

**Purpose**: Menyimpan log check-in gym per user

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Check-in ID |
| `user_id` | UUID | NOT NULL, REFERENCES auth.users(id) | User ID |
| `check_in_time` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Waktu check-in |
| `checked_in_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Alias untuk waktu check-in |
| `location` | TEXT | NULLABLE | Lokasi gym (jika multi-location) |
| `notes` | TEXT | NULLABLE | Catatan tambahan |

**Indexes**:
- `idx_check_ins_user_id` on `user_id`
- `idx_check_ins_date` on `checked_in_at`

**RLS Policies**:
- ✅ Enabled
- Users can view own check-ins
- Users can insert own check-ins

**Related Features**:
- Check-in button di ProfileView
- Total visits counter

**Last Modified**: 2026-06-28

---

### 3. `memberships` ✅ Active

**Purpose**: Menyimpan data membership aktif user

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Membership ID |
| `user_id` | UUID | REFERENCES auth.users(id) | User ID |
| `package_id` | UUID | REFERENCES membership_packages(id) | Package yang dipilih |
| `status` | TEXT | NOT NULL | Status (active/inactive/expired) |
| `start_date` | TIMESTAMP | NOT NULL | Tanggal mulai |
| `end_date` | TIMESTAMP | NOT NULL | Tanggal berakhir |
| `payment_method` | TEXT | NULLABLE | Metode pembayaran |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Waktu dibuat |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Waktu diupdate |

**Last Modified**: [Existing - need to verify]

---

### 4. `membership_packages` ✅ Active

**Purpose**: Master data package membership yang tersedia

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Package ID |
| `name` | TEXT | NOT NULL | Nama package |
| `category` | TEXT | NOT NULL | Category (individual/partnership/squad) |
| `price` | INT4 | NOT NULL | Harga |
| `period` | TEXT | NOT NULL | Period (e.g., "30 days") |
| `perks` | TEXT[] | NULLABLE | Array of perks/benefits |
| `is_popular` | BOOL | DEFAULT false | Flag popular package |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Waktu dibuat |

**Last Modified**: [Existing - need to verify]

---

### 5. `orders` ✅ Active

**Purpose**: Menyimpan order/transaksi pembelian membership

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Order ID |
| `user_id` | UUID | REFERENCES auth.users(id) | User ID |
| `package_id` | UUID | REFERENCES membership_packages(id) | Package yang dibeli |
| `item_type` | TEXT | NULLABLE | Tipe item |
| `item_id` | UUID | NULLABLE | ID item |
| `total_amount` | NUMERIC | NOT NULL | Total harga |
| `status` | TEXT | DEFAULT 'pending' | Status order |
| `payment_type` | TEXT | NULLABLE | Tipe pembayaran |
| `order_token` | TEXT | NULLABLE | Token dari payment gateway |
| `midtrans_transaction_id` | TEXT | NULLABLE | Transaction ID Midtrans |
| `raw_notification` | TEXT | NULLABLE | Raw webhook notification |
| `checkout_at` | TIMESTAMP | NULLABLE | Waktu checkout |
| `updated_at` | TIMESTAMP | NULLABLE | Waktu update terakhir |

**Last Modified**: [Existing - need to verify]

---

### 6. `trainer_packages` ✅ Active

**Purpose**: Master data package personal trainer

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Package ID |
| `name` | TEXT | NOT NULL | Nama package trainer |
| `price` | INT4 | NOT NULL | Harga |
| `session_count` | INT4 | NOT NULL | Jumlah sesi |
| `perks` | TEXT[] | NULLABLE | Benefits |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Waktu dibuat |

**Last Modified**: [Existing - need to verify]

---

### 7. `user_trainer_sessions` ✅ Active

**Purpose**: Menyimpan sesi trainer yang dibeli user

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Session ID |
| `user_id` | UUID | REFERENCES auth.users(id) | User ID |
| `trainer_package_id` | UUID | REFERENCES trainer_packages(id) | Package trainer |
| `remaining_sessions` | INT4 | NOT NULL | Sisa sesi |
| `total_sessions` | INT4 | NOT NULL | Total sesi |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Last Modified**: [Existing - need to verify]

---

## 🗂️ Storage Buckets

### 1. `profiles` ✅ Active

**Purpose**: Menyimpan profile pictures user

**Configuration**:
- **Public**: ✅ Yes (public access untuk display images)
- **File Size Limit**: 5 MB (5242880 bytes)
- **Allowed MIME Types**: 
  - `image/jpeg`
  - `image/jpg`
  - `image/png`
  - `image/webp`

**Folder Structure**:
```
profiles/
  └── avatars/
      ├── {userId}-{timestamp}.jpg
      ├── {userId}-{timestamp}.png
      └── {userId}-{timestamp}.webp
```

**Storage Policies**:
- ✅ `Users can upload avatars` - INSERT for authenticated users
- ✅ `Public access to avatars` - SELECT for public
- ✅ `Users can update avatars` - UPDATE for authenticated users
- ✅ `Users can delete avatars` - DELETE for authenticated users

**Related API**:
- `POST /api/profile/upload`

**Usage**:
```typescript
// Upload to: profiles/avatars/{userId}-{timestamp}.{ext}
// Get URL: supabase.storage.from('profiles').getPublicUrl(filePath)
```

**Last Modified**: 2026-06-28

---

## 🔐 Authentication

### Auth Tables (Supabase Built-in)

- `auth.users` - Core user authentication
- `auth.sessions` - User sessions
- `auth.refresh_tokens` - JWT refresh tokens

**Custom Extensions**:
- Profile auto-creation on signup via trigger (if implemented)

---

## 🔗 Table Relationships

```
auth.users (1) ──┬─< profiles (1) [avatar_url → profiles bucket]
                 ├─< check_ins (*)
                 ├─< memberships (*)
                 ├─< orders (*)
                 └─< user_trainer_sessions (*)

membership_packages (1) ─< memberships (*)
membership_packages (1) ─< orders (*)
trainer_packages (1) ─< user_trainer_sessions (*)
```

---

## 📝 Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For API routes

# Midtrans (Payment)
MIDTRANS_SERVER_KEY=your_midtrans_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

---

## 🚀 API Endpoints Inventory

### Profile Management
- `POST /api/profile/upload` - Upload profile picture
- `POST /api/profile/update` - Update profile data

### Payment/Checkout
- `POST /api/checkout` - Create checkout session
- `POST /api/webhooks/midtrans` - Midtrans webhook handler

---

## 📋 TODO / Planned Changes

- [ ] Add `deleted_at` soft delete untuk cleanup old avatars
- [ ] Add table `notifications` untuk push notifications
- [ ] Add table `workout_logs` untuk tracking workout
- [ ] Add bucket `documents` untuk membership documents
- [ ] Implement auto-cleanup old avatar files

---

## 📜 Changelog

### 2026-06-28 - Profile Upload Feature
**Added**:
- Storage bucket `profiles` untuk profile pictures
- Storage policies untuk bucket `profiles`
- Column tracking di document ini

**Modified**:
- Table `profiles`: Verified `avatar_url` column exists
- API routes: Created upload & update endpoints

**Migration Required**: None (column already exists)

---

### [TEMPLATE - Copy when making changes]
```
### YYYY-MM-DD - [Feature Name]
**Added**:
- [What was added]

**Modified**:
- [What was changed]

**Deleted**:
- [What was removed]

**Migration Required**: [Yes/No - SQL script if yes]
```

---

## 🛠️ Maintenance Notes

### Backup Strategy
- Supabase automatic daily backups
- Manual backup before major schema changes

### Schema Change Process
1. Document changes in this file FIRST
2. Test SQL in development/staging
3. Run migration in production
4. Update this document with completion date
5. Commit to git

### When Adding New Table
```markdown
### N. `table_name` ✅ Active

**Purpose**: [What this table is for]

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| ... | ... | ... | ... |

**Last Modified**: YYYY-MM-DD
```

### When Adding New Bucket
```markdown
### N. `bucket_name` ✅ Active

**Purpose**: [What this bucket stores]

**Configuration**:
- **Public**: Yes/No
- **File Size Limit**: X MB
- **Allowed MIME Types**: [list]

**Last Modified**: YYYY-MM-DD
```

---

## 📞 Contact / Ownership

**Database Admin**: [Your Name]  
**Last Review Date**: 2026-06-28  
**Next Review Due**: 2026-09-28 (Quarterly)

---

> 💡 **Pro Tip**: Bookmark this file! Ini adalah dokumentasi terpenting untuk development database project ini.
