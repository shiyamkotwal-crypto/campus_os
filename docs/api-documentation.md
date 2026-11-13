# CAMPUS OS — REST API Documentation (v1)

Base URL: `/api/v1`

All protected endpoints require an `Authorization: Bearer <token>` header, verified against Supabase Authentication.

---

## 1. Authentication & Identity
- `POST /auth/register` — Register student account with institutional domain validation
- `POST /auth/login` — Authenticate user and receive session token
- `POST /auth/logout` — Terminate active session
- `GET /auth/me` — Retrieve current authenticated user profile, institution, and role
- `POST /auth/refresh` — Refresh expired session token

## 2. Dashboards
- `GET /dashboard/student` — Aggregated metrics: timetable today, assignments due, attendance summary, circulars
- `GET /dashboard/faculty` — Assigned courses, submissions awaiting grading, active notices
- `GET /dashboard/admin` — Institutional analytics, department rosters, audit alerts

## 3. Announcements Hub
- `GET /announcements` — List institutional circulars (supports category, priority, and date filters)
- `GET /announcements/:id` — Announcement details
- `POST /announcements` — Publish circular (Faculty/Admin only)
- `PATCH /announcements/:id` — Modify announcement
- `DELETE /announcements/:id` — Delete announcement
- `POST /announcements/:id/read` — Mark circular as read

## 4. Academic Workspace
- `GET /academics/overview` — Current semester courses, credits, and GPA records
- `GET /academics/timetable` — Full weekly timetable filtered by semester and section
- `GET /academics/assignments` — Course assignments and submission status
- `POST /academics/assignments` — Create course assignment (Faculty only)
- `POST /academics/submissions` — Submit assignment work (Student only)
- `GET /academics/attendance` — Attendance records and percentage calculations

## 5. AI Campus Assistant (Gemini & RAG)
- `POST /ai/chat` — Context-aware Q&A with grounded document citations
- `GET /ai/sessions` — List student conversation threads
- `GET /ai/sessions/:id` — Fetch conversation history
- `DELETE /ai/sessions/:id` — Remove conversation thread
- `POST /ai/summarize` — Generate structured summary of institutional document
- `POST /ai/extract-notice` — Extract critical deadlines and actions from notice text

## 6. Institutional Documents (RAG Ingestion)
- `GET /documents` — List authorized institutional documents
- `POST /documents/upload` — Upload document to private storage
- `GET /documents/:id` — Document metadata and signed download URL
- `DELETE /documents/:id` — Remove document and cascade chunk embeddings
- `POST /documents/:id/process` — Trigger chunking, embedding generation, and vector indexing

## 7. Campus Events
- `GET /events` — Upcoming campus events, categories, and capacities
- `POST /events` — Create event (Faculty/Admin only)
- `POST /events/:id/register` — Atomic registration with capacity safeguard
- `DELETE /events/:id/register` — Cancel registration

## 8. Notifications
- `GET /notifications` — List in-app notifications
- `PATCH /notifications/:id/read` — Mark notification as read
- `PATCH /notifications/read-all` — Mark all notifications as read

## 9. Campus Services
- `GET /campus/locations` — Campus directory and building navigation
- `GET /campus/lost-found` — Active lost and found reports
- `POST /campus/lost-found` — File a lost or found report
- `PATCH /campus/lost-found/:id` — Update report status (e.g. claimed/resolved)

## 10. Student Support Helpdesk
- `GET /support/tickets` — View submitted/assigned support tickets
- `POST /support/tickets` — Open new support ticket
- `GET /support/tickets/:id` — Ticket details and message history
- `POST /support/tickets/:id/messages` — Append reply message
- `PATCH /support/tickets/:id/status` — Update ticket status (Faculty/Admin only)

## 11. Administration
- `GET /admin/users` — List institutional members with role and status filtering
- `PATCH /admin/users/:id/status` — Approve, suspend, or reactivate user
- `PATCH /admin/users/:id/role` — Update user permissions
- `GET /admin/analytics` — Platform engagement and academic stats
- `GET /admin/audit-logs` — Immutable audit log of administrative actions

