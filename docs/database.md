# CAMPUS OS — Database Documentation & Schema Reference

## 1. Overview

The CAMPUS OS database is engineered on PostgreSQL (via Supabase) with the `uuid-ossp`, `pgcrypto`, and `vector` extensions enabled. It implements 24 relational tables organized into institutional, academic, communication, services, and AI subsystems.

---

## 2. Table Catalog

| Table Name | Primary Purpose | Key Constraints |
|---|---|---|
| `institutions` | Multi-tenant educational institutions | `slug` UNIQUE, timezone default |
| `departments` | Academic departments (e.g. CSE, ECE) | FK to `institutions` |
| `programs` | Degrees offered (e.g. B.Tech, M.Tech) | FK to `departments` |
| `profiles` | User profiles extending `auth.users` | Role check, Unique institutional roll/employee ID |
| `courses` | Academic course offerings | Unique `course_code` per institution |
| `enrollments` | Student course registrations | Unique `(student_id, course_id)` |
| `announcements` | Institutional circulars & notices | Category & Priority checks, target audiences |
| `announcement_reads` | Read receipts for circulars | Unique `(announcement_id, user_id)` |
| `assignments` | Course assessments & homework | FK to `courses` and `faculty` |
| `assignment_submissions` | Student assignment work & grading | Unique `(assignment_id, student_id)` |
| `timetables` | Weekly class schedules & room allocations | Day of week (0-6), start/end times |
| `attendance_records` | Class attendance tracking | Unique `(student_id, course_id, attendance_date)` |
| `events` | Campus conferences, hackathons, sports | Capacity control, registration status |
| `event_registrations` | Student event tickets | Unique `(event_id, student_id)` |
| `notifications` | In-app alerts & reminders | Priority levels, deep-linking entity references |
| `documents` | Verified institutional files | Storage path, category, processing status |
| `document_chunks` | Chunked text with 768d vector embeddings | Vector cosine index, page references |
| `chat_sessions` | AI conversation containers | FK to `profiles`, updated_at trigger |
| `chat_messages` | Individual AI/user chat turns | Citations JSONB, role check |
| `support_tickets` | Student helpdesk requests | Category, priority, status lifecycle |
| `support_ticket_messages` | Threaded helpdesk communication | FK to `support_tickets`, attachments |
| `campus_locations` | Directory of facilities, labs, and halls | Building, floor, coordinates |
| `lost_found_items` | Campus lost and found ledger | Type (lost/found), category, status |
| `audit_logs` | Immutable security activity trail | Append-only, actor and entity tracking |

---

## 3. Vector Search Stored Procedure

The database includes the `match_document_chunks` stored procedure for sub-millisecond retrieval with institutional security isolation:

```sql
CREATE OR REPLACE FUNCTION public.match_document_chunks(
    p_query_embedding VECTOR(768),
    p_institution_id UUID,
    p_match_threshold FLOAT DEFAULT 0.5,
    p_match_count INT DEFAULT 5,
    p_department_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    document_title TEXT,
    content TEXT,
    page_number INT,
    metadata JSONB,
    similarity FLOAT
);
```

---

## 4. Atomic Operations

Event registration uses an atomic row-lock procedure (`register_for_event_atomic`) to prevent race conditions during high-demand campus registrations (e.g. hackathons).

