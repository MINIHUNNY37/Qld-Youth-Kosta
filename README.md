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

## Database schema

```
User
  id, email (unique), name, passwordHash, role (USER|ADMIN), createdAt

PrayerNote
  id, title, content, authorId -> User,
  status (PENDING|APPROVED|REJECTED), createdAt, updatedAt

Comment
  id, content, authorId -> User, prayerNoteId -> PrayerNote, createdAt

Resource
  id, title, description?, fileUrl, fileName,
  fileType (PDF|IMAGE), uploaderId -> User, createdAt
```

See [`prisma/schema.prisma`](prisma/schema.prisma).

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

Responses are JSON. All mutating endpoints validate input with Zod.

---

## Frontend component structure

```
src/
├─ app/                 # App Router pages + route handlers
│  ├─ layout.tsx
│  ├─ page.tsx          # Home
│  ├─ login/            # Auth pages (server shell + client form)
│  ├─ register/
│  ├─ prayers/
│  │  ├─ page.tsx
│  │  ├─ new/
│  │  └─ [id]/
│  ├─ resources/
│  │  ├─ page.tsx
│  │  └─ new/
│  ├─ admin/
│  └─ api/              # Route handlers
├─ components/
│  ├─ Navbar.tsx
│  ├─ Footer.tsx
│  ├─ LogoutButton.tsx
│  ├─ PrayerCard.tsx
│  ├─ ResourceCard.tsx
│  └─ CommentSection.tsx
└─ lib/
   ├─ prisma.ts         # Shared Prisma client
   ├─ auth.ts           # JWT signing/verification + cookie helpers
   ├─ bootstrap.ts      # Creates the initial admin from env vars
   ├─ validations.ts    # Zod schemas + upload config
   └─ format.ts
```

Server components fetch data from Prisma directly; interactive bits (forms,
delete buttons, comment submit) are small client components.

---

## Local setup

```bash
# 1. install deps (generates Prisma client via postinstall)
npm install

# 2. create a local env file
cp .env.example .env
# edit AUTH_SECRET and ADMIN_EMAIL / ADMIN_PASSWORD

# 3. create the SQLite database
npx prisma migrate dev --name init

# 4. run the dev server
npm run dev
```

On first request, a bootstrap admin user is created from `ADMIN_EMAIL` /
`ADMIN_PASSWORD`. Log in with those credentials to access `/admin`.

Uploads are written to `public/uploads/` and served directly by Next.js.

---

## Implementation plan (step-by-step)

1. **Scaffold project** – Next.js App Router + TypeScript + Tailwind config
   (`package.json`, `tsconfig.json`, `tailwind.config.ts`, `globals.css`).
2. **Model the domain** – Prisma schema with `User`, `PrayerNote`, `Comment`,
   `Resource`, and the `Role` / `PrayerStatus` / `ResourceType` enums.
3. **Auth layer** – bcrypt password hashing, JWT signing via `jose`, httpOnly
   cookie, server-side `getSession()` helper, and an idempotent admin
   bootstrap from env vars.
4. **API routes**
   - `auth/register|login|logout`
   - `prayers` (list/create), `prayers/[id]` (read/delete),
     `prayers/[id]/approve|reject`
   - `prayers/[id]/comments` (create), `comments/[id]` (delete)
   - `resources` (list/upload), `resources/[id]` (delete)
5. **Shared UI** – warm palette, `.card` / `.btn-primary` / `.input` design
   tokens in `globals.css`; `Navbar`, `Footer`, `PrayerCard`, `ResourceCard`,
   `CommentSection`.
6. **Pages** – Home, Prayer list + detail + new, Resource list + upload,
   Admin dashboard, Login, Register, 404.
7. **Admin moderation** – pending queue with Approve / Reject / Delete;
   approved & rejected summaries.
8. **Polish** – readable type scale (17px base), mobile-first grids,
   generous spacing, accessible focus rings, descriptive empty states.

---

## Important rules enforced in code

- Prayer notes are created with `status = PENDING` and are **excluded from
  public listings** and public detail fetches until an admin approves them
  (`src/app/api/prayers/*`).
- `DELETE /api/comments/[id]` checks `session.sub === comment.authorId ||
  session.role === 'ADMIN'` — no one else may delete.
- Uploads are restricted to `application/pdf` and `image/{png,jpeg,gif,webp}`
  with an 8 MB cap; the stored filename is a random UUID to avoid collisions
  and path-traversal from user input (see `src/app/api/resources/route.ts`).
- `AUTH_SECRET` is required for JWT signing; the code refuses to sign if it
  is missing or too short.

---

_&ldquo;Rejoice always, pray continually, give thanks in all circumstances.&rdquo; — 1 Thess 5:16–18_
