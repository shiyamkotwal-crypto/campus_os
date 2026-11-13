# CAMPUS OS — System Architecture Specification

## 1. Executive Overview

**CAMPUS OS** is an enterprise-grade, AI-powered unified campus intelligence platform designed to eliminate fragmented higher education communications, schedules, academic workflows, and campus operations. It establishes a multi-tenant, contextual intelligence layer connecting Students, Faculty, and Administrators through verified institutional records and Google's Gemini models.

---

## 2. High-Level Architectural Diagram

```
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

## 3. Technology Stack Breakdown

### Frontend
- **Framework**: React 18 with Vite and TypeScript
- **Styling**: Tailwind CSS with custom design tokens for academic SaaS
- **State Management**: TanStack Query (React Query) v5 for server state caching and optimistic updates
- **Routing**: React Router v6 with strict Role Guards (`StudentRoute`, `FacultyRoute`, `AdminRoute`)
- **Forms & Validation**: React Hook Form with Zod resolver
- **Icons & Data Visualization**: Lucide React and Recharts

### Backend
- **Runtime**: Node.js v20+ with Express.js and TypeScript
- **API Standards**: RESTful versioned endpoints (`/api/v1`)
- **Security Middleware**: Helmet, CORS, Express Rate Limiter, Centralized Error Interceptor
- **Validation**: Zod schema enforcement on requests, parameters, and AI-generated outputs

### Database & Security
- **Platform**: Supabase Cloud PostgreSQL
- **Vector Search**: PostgreSQL `pgvector` extension for 768-dimension embeddings
- **Data Isolation**: Strict multi-tenant Row Level Security (RLS) on all 24 tables
- **Storage**: Supabase Storage buckets for authorized documents, assignments, and campus photos

### Artificial Intelligence & RAG
- **SDK**: Official `@google/genai`
- **Models**: Configurable via environment variables (Gemini 2.5 Flash & text-embedding-004)
- **Pipeline**: Ingestion -> Text Normalization -> Chunking -> Vector Storage -> Filtered Multi-Tenant Cosine Search -> Grounded Synthesis with Citations

---

## 4. Multi-Tenant Isolation Strategy

Every persistent resource carries an `institution_id` foreign key. The application guarantees cross-tenant isolation through two defense-in-depth layers:

1. **Server Middleware**: Every incoming request extracts the authenticated user profile and verifies their active institutional affiliation before routing to handlers.
2. **Database Row Level Security (RLS)**: PostgreSQL policies query `public.current_user_institution()` and enforce that even if an attacker attempts parameter tampering, the database rejects queries across institutional boundaries.

