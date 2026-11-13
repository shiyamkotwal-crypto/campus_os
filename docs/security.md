# CAMPUS OS — Security Architecture & Guidelines

## 1. Threat Modeling & Core Defense Principles

CAMPUS OS enforces Defense-in-Depth across every layer: client, network transport, API middleware, and database storage.

---

## 2. Row Level Security (RLS) & Multi-Tenant Boundaries

- **Database-Level Isolation**: Supabase PostgreSQL RLS is enabled on all 24 public tables.
- **Tenant Anchor**: Every row has an `institution_id` column.
- **Session Identity**: `auth.uid()` from Supabase JWT is mapped to `public.profiles.id`. No frontend-supplied user ID is trusted.
- **Anti-Privilege Escalation**:
  - Profiles table updates explicitly check that `role = public.current_user_role()`, preventing self-promotion to `admin` or `faculty`.
  - Academic attendance and grades can only be modified by faculty members assigned to the respective course or administrators.

---

## 3. API Security & Hardening

1. **Helmet HTTP Headers**: Enforces Content Security Policy (CSP), HSTS, no-sniff, and frameguard.
2. **CORS Whitelisting**: Strict origin controls restricting API access to `CLIENT_URL`.
3. **Rate Limiting**: Express rate limiter applied across `/api/v1` routes to thwart brute-force and DDoS attempts.
4. **Zod Validation**: Every incoming request body and parameter undergoes strict schema validation, stripping unexpected keys and casting types safely.
5. **No Secret Leakage**:
   - Backend `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side Node.js processes.
   - `GEMINI_API_KEY` is never transmitted to or referenced in Vite frontend bundles.
   - Generic error responses returned to clients; detailed traces logged only to secure server outputs.

---

## 4. Artificial Intelligence & RAG Security

- **Prompt Injection Defense**: Institutional documents ingested for RAG are treated as untrusted data. Retrieval chunks are delimited inside system-guided context fences with explicit instructions forbidding instructions inside documents from overriding assistant governance.
- **Confidentiality Scope**: Vector queries are filtered by `institution_id` and access scope (`public`, `institution`, or student's assigned `department_id`). Cross-tenant document retrieval is impossible at the database query level.
- **Output Validation**: All structured AI extractions (notices, study plans, answers) are validated through Zod before being returned or stored.

