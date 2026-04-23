# QLD Youth KOSTA

A warm community web app where youth members share prayer requests, encourage
one another, and upload worship resources (lyrics, chord sheets, images).

Prayer notes require **admin approval** before becoming visible. Comments can
only be deleted by the comment author or an admin. Resource uploads support
PDF and image files.

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 14 (App Router) + TypeScript** | One codebase for UI and API, excellent DX |
| Styling | **Tailwind CSS** with a warm cream/sunrise/berry palette | Highly readable, mobile-first |
| Database | **SQLite via Prisma** | Zero setup; swap `provider` to PostgreSQL for production |
| Auth | **JWT (jose) + bcryptjs + httpOnly cookies** | Simple, no external service |
| Validation | **Zod** | Runtime safety at API boundaries |
| File storage | Local filesystem under `public/uploads/` | Simple; swap for S3/R2 when scaling |

---

## Local setup

```bash
npm install
cp .env.example .env
# edit AUTH_SECRET and ADMIN_EMAIL / ADMIN_PASSWORD
npx prisma migrate dev --name init
npm run dev
```

Then open http://localhost:3000. On first request a bootstrap admin user is
created from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Sign in with those credentials
to access `/admin`.

Uploads are written to `public/uploads/` and served directly by Next.js.

---

## Pages

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Hero + 3 latest approved prayers + 3 latest resources |
| `/prayers` | Public | List of all approved prayers |
| `/prayers/new` | Signed-in | Submit a prayer (goes to PENDING) |
| `/prayers/[id]` | Public (approved) / author / admin | Read + comment |
| `/resources` | Public | List of uploaded PDFs and images |
| `/resources/new` | Signed-in | Upload a PDF/image |
| `/admin` | Admin only | Moderation queue (approve / reject / delete) |
| `/login`, `/register` | Anonymous | Auth |

---

## API

| Method | Path | Who | Notes |
|--------|------|-----|-------|
| `POST` | `/api/auth/register` | anyone | Creates user, sets session |
| `POST` | `/api/auth/login` | anyone | Sets session cookie |
| `POST` | `/api/auth/logout` | anyone | Clears cookie |
| `GET`  | `/api/prayers` | public | Lists APPROVED; admins may pass `?status=PENDING` |
| `POST` | `/api/prayers` | signed-in | Creates a PENDING prayer |
| `GET`  | `/api/prayers/[id]` | public for approved; author/admin otherwise | |
| `DELETE` | `/api/prayers/[id]` | **admin** | |
| `POST` | `/api/prayers/[id]/approve` | **admin** | |
| `POST` | `/api/prayers/[id]/reject` | **admin** | |
| `POST` | `/api/prayers/[id]/comments` | signed-in | Only on APPROVED notes |
| `DELETE` | `/api/comments/[id]` | **comment author OR admin** | |
| `GET`  | `/api/resources` | public | |
| `POST` | `/api/resources` | signed-in | `multipart/form-data` with `file`, `title`, `description` |
| `DELETE` | `/api/resources/[id]` | **uploader OR admin** | |

---

## Important rules enforced in code

- Prayer notes are created with `status = PENDING` and are **excluded from
  public listings** and public detail fetches until an admin approves them
  (`src/app/api/prayers/*`).
- `DELETE /api/comments/[id]` checks `session.sub === comment.authorId ||
  session.role === 'ADMIN'` — no one else may delete.
- Uploads are restricted to `application/pdf` and `image/{png,jpeg,gif,webp}`
  with an 8 MB cap; the stored filename is a random UUID to avoid collisions
  and path-traversal from user input.
- `AUTH_SECRET` is required for JWT signing; the code refuses to sign if it
  is missing or too short.

---

_"Rejoice always, pray continually, give thanks in all circumstances." — 1 Thess 5:16–18_
