# CAMPUS OS — Production Deployment Guide

## 1. Cloud Architecture Overview

- **Frontend**: Deployed on **Vercel** or **Netlify** as a high-performance static SPA with edge CDN distribution.
- **Backend API**: Deployed on **Render**, **Railway**, **Fly.io**, or **AWS ECS/App Runner** running Node.js / Express.
- **Database & Storage**: Managed **Supabase Cloud PostgreSQL** with `pgvector` enabled and Supabase Storage S3-compatible buckets.
- **AI Processing**: Google Gemini API via official `@google/genai` SDK.

---

## 2. Supabase Cloud Configuration

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings -> Database** and copy:
   - Direct connection string (`DATABASE_URL`) or Transaction/Session Pooler URL.
3. Go to **Project Settings -> API** and copy:
   - Project URL (`SUPABASE_URL`)
   - `anon` public key (`SUPABASE_ANON_KEY`)
   - `service_role` secret key (`SUPABASE_SERVICE_ROLE_KEY`)
4. Run Database Migration:
   - Navigate to `/supabase` in this repo and run:
     ```bash
     npm install
     npm run migrate
     ```
   - *Or* paste `/supabase/migrations/001_initial_schema.sql` into the Supabase Dashboard SQL Editor and click **Run**.
5. Enable Storage Buckets:
   - Create bucket `documents` (Private)
   - Create bucket `attachments` (Private)
   - Create bucket `avatars` (Public)

---

## 3. Backend Deployment (e.g. Render / Railway)

1. Root Directory: `server`
2. Build Command: `npm install && npm run build`
3. Start Command: `npm run start`
4. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `CLIENT_URL=https://your-campus-os.vercel.app`
   - `SUPABASE_URL=https://<ref>.supabase.co`
   - `SUPABASE_ANON_KEY=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...`
   - `DATABASE_URL=...`
   - `GEMINI_API_KEY=...`
   - `GEMINI_MODEL=gemini-2.5-flash`
   - `GEMINI_EMBEDDING_MODEL=text-embedding-004`
   - `JWT_SECRET=...`

---

## 4. Frontend Deployment (e.g. Vercel)

1. Root Directory: `client`
2. Framework Preset: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Set Environment Variables:
   - `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api/v1`
   - `VITE_SUPABASE_URL=https://<ref>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=...`

