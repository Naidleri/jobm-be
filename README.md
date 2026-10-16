## Prasyarat

- Node.js 22 atau lebih baru
- PostgreSQL

## Instalasi

```bash
npm install
```

Buat file `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
JWT_SECRET="ganti-dengan-secret-yang-aman"
PORT=3000
```

Jalankan migrasi database:

```bash
npm run db:migrate:deploy
```

Untuk membuat data development, jalankan:

```bash
npm run db:seed
```

Seed membuat tiga akun company dan sepuluh lowongan. Akun company yang
tersedia:

| Nama | Email |
| --- | --- |
| abc | `abc@company.local` |
| xyz | `xyz@company.local` |
| sss | `sss@company.local` |

Password default: `Password123!`. Gunakan `SEED_COMPANY_PASSWORD` untuk
mengganti password saat menjalankan seed.

## Menjalankan aplikasi

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run build
npm run start:prod
```

API tersedia di `http://localhost:3000/api`.

## Endpoint utama

### Autentikasi

```text
POST /api/auth/register/job-seeker
POST /api/auth/register/company
POST /api/auth/login
```

### Lowongan dan lamaran

```text
GET  /api/jobs
GET  /api/jobs/:jobId
POST /api/jobs/:jobId/applications
GET  /api/me/applications
GET  /api/applications/:applicationId/history
```

Endpoint lamaran memerlukan autentikasi. Pengajuan lamaran, daftar lamaran
pribadi, dan riwayat lamaran hanya dapat diakses oleh akun `JOB_SEEKER`.

### Company

```text
POST  /api/company/jobs
GET   /api/company/jobs
GET   /api/company/jobs/:jobId/applications
PATCH /api/company/applications/:applicationId/status
```

Endpoint company memerlukan autentikasi akun `COMPANY`.

## Pengujian

```bash
npm test
npm run test:e2e
npm run test:cov
```

## Lint

```bash
npm run lint
```
