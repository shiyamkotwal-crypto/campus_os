<<<<<<< HEAD
# CAMPUS OS
> **Your Entire Campus. One Intelligent Platform.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini%202.5%20Flash-4285F4?logo=google)](https://ai.google.dev)
[![Vector Store](https://img.shields.io/badge/Vector-pgvector%20(768d)-0284c7)](https://github.com/pgvector/pgvector)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-61DAFB?logo=react)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20TypeScript-339933?logo=node.js)](https://nodejs.org)

---

## 1. Executive Product Overview

**CAMPUS OS** is an AI-powered unified campus intelligence and management platform engineered for higher education institutions. It breaks down information silos across academic departments, student administration, campus logistics, and event coordination by establishing a multi-tenant, contextual intelligence layer powered by **Google Gemini** models and **Supabase PostgreSQL** with **pgvector**.

### Key Differentiators
- **Grounded Campus AI**: Unlike generic chatbots, the CAMPUS OS Assistant uses Retrieval-Augmented Generation (RAG) strictly bounded to authorized institutional documents (academic codes, exam regulations, syllabi), returning responses with page-numbered source citations.
- **Strict Multi-Tenant Isolation**: Enforces institution boundaries and role-based permissions at both the API middleware and database level using PostgreSQL Row Level Security (RLS) across all 24 relational tables.
- **Unified Academic Workspace**: Consolidated views for weekly schedules, course registrations, atomic event capacity signups, assignment submissions, and attendance tracking against the 75% institutional requirement.
- **Digital Campus Services**: Integrated lost and found reporting with privacy protection, campus building navigation directory, and student support ticketing with threaded conversation history.

---

## 2. System Architecture

```text
+---------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                    |
|   React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Recharts         |
|   - Student Workspace    - Faculty Portal    - Administrative Center            |
|   - Real-time AI Assistant with Document Citations & Structured Prompts         |
+----------------------------------------+----------------------------------------+
                                         | REST / HTTPS (Bearer Token Auth)
                                         v
+---------------------------------------------------------------------------------+
|                              API & BACKEND LAYER                                |
|   Node.js + Express.js + TypeScript Architecture (under /api/v1)                |
|   - Auth & Session Guard (Supabase JWT / Profiles Verification)                 |
|   - Rate Limiting, Helmet Security Headers, Structured Morgan Logging           |
|   - Zod Input & Output Schema Validation Middleware                             |
|   - Role-Based Access Control (RBAC) & Tenant Isolation Engine                  |
+-------------------+--------------------+--------------------+-------------------+
                    |                    |                    |
                    v                    v                    v
+-----------------------+  +-----------------------+  +-----------------------+
|   DATABASE & STORAGE  |  |    AI & RAG ENGINE    |  |    CAMPUS SERVICES    |
| Supabase PostgreSQL   |  | Google @google/genai  |  | - Lost & Found        |
| - Row Level Security  |  | - Gemini 2.5 Flash    |  | - Navigation/Maps     |
| - pgvector Embeddings |  | - text-embedding-004  |  | - Support Ticketing   |
| - 24 Core Entities    |  | - Chunking & Scoring  |  | - Event Capacity RPC  |
| - Atomic RPC Procs    |  | - Strict Zod Parsers  |  | - Timetable Engine    |
+-----------------------+  +-----------------------+  +-----------------------+
```

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, TanStack Query v5, Recharts, Lucide React, React Hook Form, Zod |
| **Backend** | Node.js v20+, Express.js, TypeScript, REST API (`/api/v1`), Helmet, CORS, Morgan |
| **Database & Auth** | Supabase Cloud PostgreSQL, Supabase Auth, PostgreSQL Row Level Security (RLS), `pgvector` (768d), `uuid-ossp`, `pgcrypto` |
| **AI Integration** | Official `@google/genai` SDK, Google Gemini 2.5 Flash, `text-embedding-004`, RAG retrieval pipeline |
| **Validation** | Zod schema validation for API payloads and AI-generated structured JSON |

---

## 4. Database Schema (24 Relational Entities)

The complete SQL migration and seed script is located at:
`supabase/migrations/001_initial_schema.sql`

1. **`institutions`**: Multi-tenant institution records, slug, domains, timezone
2. **`departments`**: Academic departments (CSE, ECE, Mechanical)
3. **`programs`**: Degrees offered (B.Tech, M.Tech)
4. **`profiles`**: User identities extending `auth.users` with student/faculty/admin roles
5. **`courses`**: Course catalog (CS301 Distributed Systems, CS305 AI & Neural Networks)
6. **`enrollments`**: Student course registrations
7. **`announcements`**: Official circulars with audience targeting and priority levels
8. **`announcement_reads`**: Read receipts tracking
9. **`assignments`**: Course assessments, due dates, max marks
10. **`assignment_submissions`**: Student work, submission URLs, feedback, grading
11. **`timetables`**: Weekly lecture schedules, days, room allocations
12. **`attendance_records`**: Daily attendance tracking (Present, Absent, Excused)
13. **`events`**: Campus symposiums, hackathons, seminars with capacity tracking
14. **`event_registrations`**: Student event bookings (with atomic row-locking)
15. **`notifications`**: Targeted user alerts with priority classifications
16. **`documents`**: Verified institutional PDF/text files
17. **`document_chunks`**: Document text chunks with 768-dimensional `VECTOR(768)` embeddings
18. **`chat_sessions`**: User AI conversation sessions
19. **`chat_messages`**: Individual chat exchanges with document citations
20. **`support_tickets`**: Student helpdesk requests (Academic, IT, Facilities)
21. **`support_ticket_messages`**: Threaded conversation history on tickets
22. **`campus_locations`**: Directory of buildings, laboratories, and halls
23. **`lost_found_items`**: Campus lost and found registry with contact privacy protection
24. **`audit_logs`**: Immutable security audit trail of administrative modifications

---

## 5. Instant Demonstration Accounts

CAMPUS OS includes pre-configured demonstration accounts for **Apex Institute of Technology (`apex-tech`)**:

| Role | Persona | Email | Password |
|---|---|---|---|
| **Student** | Alex Rivera (3rd Yr CSE) | `alex.rivera@student.apex.edu` | `CampusOS@2026` |
| **Faculty** | Dr. Sarah Jenkins (CSE) | `sarah.jenkins@apex.edu` | `CampusOS@2026` |
| **Administrator** | Dr. Arthur Vance (Dean) | `admin@apex.edu` | `CampusOS@2026` |

> 💡 **Quick Persona Switcher**: In the application navbar, click the **Role** badge to switch between Student, Faculty, and Admin personas in one click!

---

## 6. Getting Started Locally

### Prerequisites
- Node.js v20+ or v22+
- npm v10+

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-org/campus-os.git
cd campus-os

# Install root, backend, and frontend dependencies
npm install
npm install --workspace=server
npm install --workspace=client
npm install --workspace=supabase
```

### 2. Configure Environment Variables
Copy the provided `.env.example` templates:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` to configure your Supabase and Gemini credentials:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgres://postgres.your-project:password@aws-0-region.pooler.supabase.com:6543/postgres
GEMINI_API_KEY=your-google-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
```

### 3. Apply Supabase Database Migrations & Seeds
Run the automated migration runner to apply the complete schema, RLS policies, vector indices, and demonstration seed data:
```bash
npm run migrate
```
*Alternatively, copy the contents of `supabase/migrations/001_initial_schema.sql` directly into your Supabase Dashboard SQL Editor and click **Run**.*

### 4. Start Development Servers
```bash
# Run both Backend API and React Frontend concurrently
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api/v1`
- **API Health Check**: `http://localhost:5000/api/health`

---

## 7. Production Build Verification

To verify full production compilation:
```bash
npm run build
```
This compiles both:
- `client`: Vite bundle into `client/dist/`
- `server`: TypeScript compilation into `server/dist/`

---

## 8. Security & Compliance

- **Row Level Security (RLS)**: Enabled across all 24 database tables. Policies explicitly enforce `auth.uid()` derivation and institutional boundaries.
- **Credential Safety**: Service-role keys and Gemini API keys are strictly confined to server-side environments; never exposed to browser bundles.
- **RAG Defense**: Ingested institutional documents are fenced as untrusted data; prompt injection attempts are blocked by system-level prompt constraints.
- **Input Sanitization**: Request bodies, route parameters, and AI-generated outputs are validated against strict Zod schemas.

---

## 9. Comprehensive Documentation Index

- [Architecture Specification](docs/architecture.md)
- [Database Schema & Stored Procedures](docs/database.md)
- [REST API Catalog](docs/api-documentation.md)
- [Security Guidelines & Threat Model](docs/security.md)
- [Cloud Deployment Manual](docs/deployment.md)
- [Master Development Status Report](DEVELOPMENT_STATUS.md)

---

## 10. License

Released under the **MIT License**. Engineered for modern educational institutions.

=======
# campus_os
>>>>>>> b9cca245f946279b99bc21f3a1b832976904f299
