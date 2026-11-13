-- ==============================================================================
-- CAMPUS OS — 001_initial_schema.sql
-- Production Database Schema, Row Level Security (RLS) Policies & Demonstration Seed Data
-- ==============================================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ------------------------------------------------------------------------------
-- 1. INSTITUTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    official_email_domains TEXT[] NOT NULL DEFAULT '{}',
    logo_url TEXT,
    address JSONB DEFAULT '{}'::jsonb,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2. DEPARTMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. PROGRAMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    degree_type TEXT NOT NULL, -- e.g. B.Tech, M.Tech, B.Sc
    duration_years INTEGER NOT NULL DEFAULT 4,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. PROFILES (Extends Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- Maps directly to auth.users.id
    institution_id UUID REFERENCES public.institutions(id) ON DELETE RESTRICT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    institutional_id TEXT, -- e.g. Roll No / Employee Code
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    academic_year INTEGER,
    semester INTEGER,
    avatar_url TEXT,
    account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'pending', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_institution_institutional_id UNIQUE (institution_id, institutional_id)
);

-- ------------------------------------------------------------------------------
-- 5. COURSES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    academic_year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_institution_course_code UNIQUE (institution_id, course_code)
);

-- ------------------------------------------------------------------------------
-- 6. ENROLLMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrollment_status TEXT NOT NULL DEFAULT 'active' CHECK (enrollment_status IN ('active', 'completed', 'dropped')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_course UNIQUE (student_id, course_id)
);

-- ------------------------------------------------------------------------------
-- 7. ANNOUNCEMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('academic', 'examination', 'department', 'emergency', 'event', 'general')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    target_departments UUID[] DEFAULT '{}',
    target_academic_years INTEGER[] DEFAULT '{}',
    target_semesters INTEGER[] DEFAULT '{}',
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 8. ANNOUNCEMENT READS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcement_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_announcement_user UNIQUE (announcement_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 9. ASSIGNMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    due_at TIMESTAMPTZ NOT NULL,
    attachment_url TEXT,
    max_marks NUMERIC(5, 2) DEFAULT 100.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 10. ASSIGNMENT SUBMISSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_url TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late', 'resubmitted')),
    marks NUMERIC(5, 2),
    feedback TEXT,
    CONSTRAINT uq_assignment_student UNIQUE (assignment_id, student_id)
);

-- ------------------------------------------------------------------------------
-- 11. TIMETABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    academic_year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday ... 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room TEXT NOT NULL,
    faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 12. ATTENDANCE RECORDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'excused')),
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_course_date UNIQUE (student_id, course_id, attendance_date)
);

-- ------------------------------------------------------------------------------
-- 13. EVENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('workshop', 'hackathon', 'cultural', 'sports', 'seminar', 'general')),
    location TEXT NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 100,
    registration_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 14. EVENT REGISTRATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended')),
    CONSTRAINT uq_event_student UNIQUE (event_id, student_id)
);

-- ------------------------------------------------------------------------------
-- 15. NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    related_entity_type TEXT,
    related_entity_id UUID,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 16. DOCUMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('policy', 'syllabus', 'handbook', 'notice', 'form', 'general')),
    storage_path TEXT NOT NULL,
    mime_type TEXT,
    file_size BIGINT,
    access_scope TEXT NOT NULL DEFAULT 'institution' CHECK (access_scope IN ('institution', 'department', 'public')),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 17. DOCUMENT CHUNKS (RAG Vector Store)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    page_number INTEGER,
    embedding VECTOR(768),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 18. CHAT SESSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 19. CHAT MESSAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 20. SUPPORT TICKETS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('academic', 'technical', 'administrative', 'facilities', 'general')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 21. SUPPORT TICKET MESSAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachment_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 22. CAMPUS LOCATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campus_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('academic', 'library', 'laboratory', 'administrative', 'cafeteria', 'sports', 'support', 'other')),
    description TEXT,
    building TEXT NOT NULL,
    floor TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 23. LOST AND FOUND ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lost_found_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    description TEXT,
    report_type TEXT NOT NULL CHECK (report_type IN ('lost', 'found')),
    category TEXT NOT NULL CHECK (category IN ('electronics', 'stationery', 'clothing', 'identity_card', 'accessories', 'other')),
    location_description TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'resolved', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 24. AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & QUERY ACCELERATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_institution_role ON public.profiles(institution_id, role);
CREATE INDEX IF NOT EXISTS idx_announcements_inst_published ON public.announcements(institution_id, published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_institution_faculty ON public.courses(institution_id, faculty_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course_due ON public.assignments(course_id, due_at ASC);
CREATE INDEX IF NOT EXISTS idx_attendance_student_course ON public.attendance_records(student_id, course_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_timetables_inst_day ON public.timetables(institution_id, day_of_week, start_time);
CREATE INDEX IF NOT EXISTS idx_events_inst_start ON public.events(institution_id, start_at ASC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_documents_inst ON public.documents(institution_id, access_scope);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_doc ON public.document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_student ON public.support_tickets(student_id, status);
CREATE INDEX IF NOT EXISTS idx_lost_found_inst ON public.lost_found_items(institution_id, report_type, status);

-- Vector Index on document_chunks embedding (IVFFLAT with Cosine Distance)
CREATE INDEX IF NOT EXISTS idx_doc_chunks_embedding 
ON public.document_chunks 
USING hnsw (embedding vector_cosine_ops);

-- ==============================================================================
-- DATABASE HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Function: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS tr_institutions_updated_at ON public.institutions; CREATE TRIGGER tr_institutions_updated_at BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles; CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS tr_announcements_updated_at ON public.announcements; CREATE TRIGGER tr_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS tr_chat_sessions_updated_at ON public.chat_sessions; CREATE TRIGGER tr_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS tr_support_tickets_updated_at ON public.support_tickets; CREATE TRIGGER tr_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function: Vector similarity match for RAG with institution & scope boundaries
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
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        d.title AS document_title,
        dc.content,
        dc.page_number,
        dc.metadata,
        (1 - (dc.embedding <=> p_query_embedding))::FLOAT AS similarity
    FROM public.document_chunks dc
    JOIN public.documents d ON dc.document_id = d.id
    WHERE dc.institution_id = p_institution_id
      AND d.processing_status = 'completed'
      AND (
          d.access_scope = 'public' 
          OR d.access_scope = 'institution'
          OR (d.access_scope = 'department' AND (p_department_id IS NULL OR d.department_id = p_department_id))
      )
      AND (1 - (dc.embedding <=> p_query_embedding)) > p_match_threshold
    ORDER BY dc.embedding <=> p_query_embedding
    LIMIT p_match_count;
END;
$$;

-- Function: Atomic event registration with capacity guard
CREATE OR REPLACE FUNCTION public.register_for_event_atomic(
    p_event_id UUID,
    p_student_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_capacity INT;
    v_current_count INT;
    v_registration_enabled BOOLEAN;
    v_existing_reg UUID;
    v_new_id UUID;
BEGIN
    -- Check event existence and lock row
    SELECT capacity, registration_enabled INTO v_capacity, v_registration_enabled
    FROM public.events
    WHERE id = p_event_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event not found');
    END IF;

    IF NOT v_registration_enabled THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event registration is closed');
    END IF;

    -- Check if student already registered
    SELECT id INTO v_existing_reg
    FROM public.event_registrations
    WHERE event_id = p_event_id AND student_id = p_student_id;

    IF FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Student is already registered for this event');
    END IF;

    -- Check current active registrations
    SELECT COUNT(*) INTO v_current_count
    FROM public.event_registrations
    WHERE event_id = p_event_id AND status = 'registered';

    IF v_current_count >= v_capacity THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event is at full capacity');
    END IF;

    -- Insert registration
    INSERT INTO public.event_registrations (event_id, student_id, status)
    VALUES (p_event_id, p_student_id, 'registered')
    RETURNING id INTO v_new_id;

    RETURN jsonb_build_object('success', true, 'registration_id', v_new_id, 'message', 'Successfully registered');
END;
$$;

-- Function: Auto-create Profile on Supabase auth.users Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_institution_id UUID;
    v_role TEXT;
    v_full_name TEXT;
    v_institutional_id TEXT;
    v_dept_id UUID;
    v_prog_id UUID;
    v_academic_year INT;
    v_semester INT;
BEGIN
    -- Extract metadata safely
    v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
    v_institutional_id := NEW.raw_user_meta_data->>'institutional_id';
    
    -- Extract UUIDs if present
    IF NEW.raw_user_meta_data->>'institution_id' IS NOT NULL THEN
        v_institution_id := (NEW.raw_user_meta_data->>'institution_id')::UUID;
    END IF;
    IF NEW.raw_user_meta_data->>'department_id' IS NOT NULL THEN
        v_dept_id := (NEW.raw_user_meta_data->>'department_id')::UUID;
    END IF;
    IF NEW.raw_user_meta_data->>'program_id' IS NOT NULL THEN
        v_prog_id := (NEW.raw_user_meta_data->>'program_id')::UUID;
    END IF;
    IF NEW.raw_user_meta_data->>'academic_year' IS NOT NULL THEN
        v_academic_year := (NEW.raw_user_meta_data->>'academic_year')::INT;
    END IF;
    IF NEW.raw_user_meta_data->>'semester' IS NOT NULL THEN
        v_semester := (NEW.raw_user_meta_data->>'semester')::INT;
    END IF;

    -- Ensure institution fallback if none provided (first active institution)
    IF v_institution_id IS NULL THEN
        SELECT id INTO v_institution_id FROM public.institutions LIMIT 1;
    END IF;

    INSERT INTO public.profiles (
        id,
        institution_id,
        full_name,
        email,
        role,
        institutional_id,
        department_id,
        program_id,
        academic_year,
        semester,
        account_status
    )
    VALUES (
        NEW.id,
        v_institution_id,
        v_full_name,
        NEW.email,
        v_role,
        v_institutional_id,
        v_dept_id,
        v_prog_id,
        v_academic_year,
        v_semester,
        'active'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION public.current_user_institution()
RETURNS UUID AS $$
    SELECT institution_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. INSTITUTIONS POLICIES
DROP POLICY IF EXISTS "Public read institutions" ON public.institutions;
CREATE POLICY "Public read institutions" ON public.institutions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins update own institution" ON public.institutions;
CREATE POLICY "Admins update own institution" ON public.institutions FOR UPDATE 
USING (id = public.current_user_institution() AND public.current_user_role() = 'admin');

-- 2. PROFILES POLICIES
DROP POLICY IF EXISTS "Read profiles in same institution" ON public.profiles;
CREATE POLICY "Read profiles in same institution" ON public.profiles FOR SELECT
USING (institution_id = public.current_user_institution() OR id = auth.uid());

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = public.current_user_role()); -- Prevent self role escalation

DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL
USING (institution_id = public.current_user_institution() AND public.current_user_role() = 'admin');

-- 3. DEPARTMENTS & PROGRAMS POLICIES
DROP POLICY IF EXISTS "Read departments in institution" ON public.departments;
CREATE POLICY "Read departments in institution" ON public.departments FOR SELECT
USING (institution_id = public.current_user_institution());
DROP POLICY IF EXISTS "Admins manage departments" ON public.departments;
CREATE POLICY "Admins manage departments" ON public.departments FOR ALL
USING (institution_id = public.current_user_institution() AND public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "Read programs in institution" ON public.programs;
CREATE POLICY "Read programs in institution" ON public.programs FOR SELECT
USING (institution_id = public.current_user_institution());
DROP POLICY IF EXISTS "Admins manage programs" ON public.programs;
CREATE POLICY "Admins manage programs" ON public.programs FOR ALL
USING (institution_id = public.current_user_institution() AND public.current_user_role() = 'admin');

-- 4. COURSES POLICIES
DROP POLICY IF EXISTS "Read courses in institution" ON public.courses;
CREATE POLICY "Read courses in institution" ON public.courses FOR SELECT
USING (institution_id = public.current_user_institution());
DROP POLICY IF EXISTS "Faculty manage assigned courses" ON public.courses;
CREATE POLICY "Faculty manage assigned courses" ON public.courses FOR ALL
USING (institution_id = public.current_user_institution() AND (faculty_id = auth.uid() OR public.current_user_role() = 'admin'));

-- 5. ENROLLMENTS POLICIES
DROP POLICY IF EXISTS "Students read own enrollments" ON public.enrollments;
CREATE POLICY "Students read own enrollments" ON public.enrollments FOR SELECT
USING (student_id = auth.uid());
DROP POLICY IF EXISTS "Faculty read course enrollments" ON public.enrollments;
CREATE POLICY "Faculty read course enrollments" ON public.enrollments FOR SELECT
USING (course_id IN (SELECT id FROM public.courses WHERE faculty_id = auth.uid()) OR public.current_user_role() = 'admin');
DROP POLICY IF EXISTS "Admins manage enrollments" ON public.enrollments;
CREATE POLICY "Admins manage enrollments" ON public.enrollments FOR ALL
USING (institution_id = public.current_user_institution() AND public.current_user_role() = 'admin');

-- 6. ANNOUNCEMENTS POLICIES
DROP POLICY IF EXISTS "Read published announcements in institution" ON public.announcements;
CREATE POLICY "Read published announcements in institution" ON public.announcements FOR SELECT
USING (
    institution_id = public.current_user_institution() 
    AND (published = true OR author_id = auth.uid() OR public.current_user_role() = 'admin')
);
DROP POLICY IF EXISTS "Faculty and admin create announcements" ON public.announcements;
CREATE POLICY "Faculty and admin create announcements" ON public.announcements FOR INSERT
WITH CHECK (
    institution_id = public.current_user_institution() 
    AND public.current_user_role() IN ('faculty', 'admin')
);
DROP POLICY IF EXISTS "Author or admin update announcements" ON public.announcements;
CREATE POLICY "Author or admin update announcements" ON public.announcements FOR UPDATE
USING (
    institution_id = public.current_user_institution() 
    AND (author_id = auth.uid() OR public.current_user_role() = 'admin')
);

-- 7. ANNOUNCEMENT READS
DROP POLICY IF EXISTS "Manage own announcement reads" ON public.announcement_reads;
CREATE POLICY "Manage own announcement reads" ON public.announcement_reads FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 8. ASSIGNMENTS POLICIES
DROP POLICY IF EXISTS "Read course assignments" ON public.assignments;
CREATE POLICY "Read course assignments" ON public.assignments FOR SELECT
USING (
    course_id IN (SELECT course_id FROM public.enrollments WHERE student_id = auth.uid())
    OR faculty_id = auth.uid()
    OR public.current_user_role() = 'admin'
);
DROP POLICY IF EXISTS "Faculty create and manage assignments" ON public.assignments;
CREATE POLICY "Faculty create and manage assignments" ON public.assignments FOR ALL
USING (
    faculty_id = auth.uid() OR public.current_user_role() = 'admin'
);

-- 9. ASSIGNMENT SUBMISSIONS POLICIES
DROP POLICY IF EXISTS "Students manage own submissions" ON public.assignment_submissions;
CREATE POLICY "Students manage own submissions" ON public.assignment_submissions FOR ALL
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Faculty review submissions for their courses" ON public.assignment_submissions;
CREATE POLICY "Faculty review submissions for their courses" ON public.assignment_submissions FOR SELECT
USING (
    assignment_id IN (SELECT id FROM public.assignments WHERE faculty_id = auth.uid())
    OR public.current_user_role() = 'admin'
);

DROP POLICY IF EXISTS "Faculty grade submissions" ON public.assignment_submissions;
CREATE POLICY "Faculty grade submissions" ON public.assignment_submissions FOR UPDATE
USING (
    assignment_id IN (SELECT id FROM public.assignments WHERE faculty_id = auth.uid())
    OR public.current_user_role() = 'admin'
);

-- 10. TIMETABLES POLICIES
DROP POLICY IF EXISTS "Read timetables in institution" ON public.timetables;
CREATE POLICY "Read timetables in institution" ON public.timetables FOR SELECT
USING (institution_id = public.current_user_institution());
DROP POLICY IF EXISTS "Admins manage timetables" ON public.timetables;
CREATE POLICY "Admins manage timetables" ON public.timetables FOR ALL
USING (institution_id = public.current_user_institution() AND public.current_user_role() = 'admin');

-- 11. ATTENDANCE POLICIES
DROP POLICY IF EXISTS "Students read own attendance" ON public.attendance_records;
CREATE POLICY "Students read own attendance" ON public.attendance_records FOR SELECT
USING (student_id = auth.uid());
DROP POLICY IF EXISTS "Faculty manage course attendance" ON public.attendance_records;
CREATE POLICY "Faculty manage course attendance" ON public.attendance_records FOR ALL
USING (
    course_id IN (SELECT id FROM public.courses WHERE faculty_id = auth.uid())
    OR public.current_user_role() = 'admin'
);

-- 12. EVENTS POLICIES
DROP POLICY IF EXISTS "Read events in institution" ON public.events;
CREATE POLICY "Read events in institution" ON public.events FOR SELECT
USING (institution_id = public.current_user_institution());
DROP POLICY IF EXISTS "Staff and admin manage events" ON public.events;
CREATE POLICY "Staff and admin manage events" ON public.events FOR ALL
USING (institution_id = public.current_user_institution() AND public.current_user_role() IN ('faculty', 'admin'));

-- 13. EVENT REGISTRATIONS POLICIES
DROP POLICY IF EXISTS "Students manage own registrations" ON public.event_registrations;
CREATE POLICY "Students manage own registrations" ON public.event_registrations FOR ALL
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());
DROP POLICY IF EXISTS "Organizers view registrations" ON public.event_registrations;
CREATE POLICY "Organizers view registrations" ON public.event_registrations FOR SELECT
USING (
    event_id IN (SELECT id FROM public.events WHERE organizer_id = auth.uid())
    OR public.current_user_role() = 'admin'
);

-- 14. NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 15. DOCUMENTS & CHUNKS POLICIES
DROP POLICY IF EXISTS "Read authorized documents" ON public.documents;
CREATE POLICY "Read authorized documents" ON public.documents FOR SELECT
USING (
    institution_id = public.current_user_institution()
    AND (
        access_scope = 'public'
        OR access_scope = 'institution'
        OR (access_scope = 'department' AND department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid()))
        OR uploaded_by = auth.uid()
        OR public.current_user_role() = 'admin'
    )
);
DROP POLICY IF EXISTS "Admins and faculty manage documents" ON public.documents;
CREATE POLICY "Admins and faculty manage documents" ON public.documents FOR ALL
USING (institution_id = public.current_user_institution() AND public.current_user_role() IN ('faculty', 'admin'));

DROP POLICY IF EXISTS "Read document chunks" ON public.document_chunks;
CREATE POLICY "Read document chunks" ON public.document_chunks FOR SELECT
USING (
    institution_id = public.current_user_institution()
    AND document_id IN (SELECT id FROM public.documents)
);

-- 16. CHAT SESSIONS & MESSAGES POLICIES
DROP POLICY IF EXISTS "Users manage own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users manage own chat sessions" ON public.chat_sessions FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users manage own chat messages" ON public.chat_messages;
CREATE POLICY "Users manage own chat messages" ON public.chat_messages FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 17. SUPPORT TICKETS POLICIES
DROP POLICY IF EXISTS "Students manage own support tickets" ON public.support_tickets;
CREATE POLICY "Students manage own support tickets" ON public.support_tickets FOR ALL
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Faculty and admin view and update tickets" ON public.support_tickets;
CREATE POLICY "Faculty and admin view and update tickets" ON public.support_tickets FOR ALL
USING (
    institution_id = public.current_user_institution() 
    AND (assigned_to = auth.uid() OR public.current_user_role() IN ('faculty', 'admin'))
);

DROP POLICY IF EXISTS "Ticket participants manage messages" ON public.support_ticket_messages;
CREATE POLICY "Ticket participants manage messages" ON public.support_ticket_messages FOR ALL
USING (
    ticket_id IN (SELECT id FROM public.support_tickets WHERE student_id = auth.uid() OR assigned_to = auth.uid() OR public.current_user_role() = 'admin')
);

-- 18. CAMPUS LOCATIONS POLICIES
DROP POLICY IF EXISTS "Read campus locations" ON public.campus_locations;
CREATE POLICY "Read campus locations" ON public.campus_locations FOR SELECT
USING (institution_id = public.current_user_institution());
DROP POLICY IF EXISTS "Admins manage campus locations" ON public.campus_locations;
CREATE POLICY "Admins manage campus locations" ON public.campus_locations FOR ALL
USING (institution_id = public.current_user_institution() AND public.current_user_role() = 'admin');

-- 19. LOST AND FOUND POLICIES
DROP POLICY IF EXISTS "Read lost and found in institution" ON public.lost_found_items;
CREATE POLICY "Read lost and found in institution" ON public.lost_found_items FOR SELECT
USING (institution_id = public.current_user_institution());
DROP POLICY IF EXISTS "Users report lost and found" ON public.lost_found_items;
CREATE POLICY "Users report lost and found" ON public.lost_found_items FOR INSERT
WITH CHECK (reported_by = auth.uid() AND institution_id = public.current_user_institution());
DROP POLICY IF EXISTS "Reporter or admin update lost and found" ON public.lost_found_items;
CREATE POLICY "Reporter or admin update lost and found" ON public.lost_found_items FOR UPDATE
USING (reported_by = auth.uid() OR public.current_user_role() = 'admin');

-- 20. AUDIT LOGS POLICIES
DROP POLICY IF EXISTS "Admins read audit logs" ON public.audit_logs;
CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT
USING (institution_id = public.current_user_institution() AND public.current_user_role() = 'admin');
DROP POLICY IF EXISTS "System insert audit logs" ON public.audit_logs;
CREATE POLICY "System insert audit logs" ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- ==============================================================================
-- DEMONSTRATION SEED DATA (Apex Institute of Technology)
-- ==============================================================================

-- 1. Demo Institution
INSERT INTO public.institutions (id, name, slug, official_email_domains, logo_url, address, timezone)
VALUES (
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Apex Institute of Technology',
    'apex-tech',
    ARRAY['apex.edu', 'student.apex.edu'],
    'https://images.unsplash.com/photo-1562774053-701939374585?w=256&h=256&fit=crop&crop=faces',
    '{"street": "100 Technology Boulevard", "city": "Bengaluru", "state": "Karnataka", "postal_code": "560100", "country": "India"}'::jsonb,
    'Asia/Kolkata'
) ON CONFLICT (id) DO NOTHING;

-- 2. Demo Departments
INSERT INTO public.departments (id, institution_id, name, code, description) VALUES
('d0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Computer Science and Engineering', 'CSE', 'Department of Computer Science and Engineering'),
('d0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Electronics and Communication', 'ECE', 'Department of Electronics and Communication Engineering'),
('d0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Mechanical Engineering', 'MECH', 'Department of Mechanical and Mechatronics Engineering')
ON CONFLICT (id) DO NOTHING;

-- 3. Demo Programs
INSERT INTO public.programs (id, institution_id, department_id, name, degree_type, duration_years) VALUES
('b0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 'B.Tech Computer Science and Engineering', 'B.Tech', 4),
('b0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'd0000000-0000-0000-0000-000000000002'::uuid, 'B.Tech Electronics and Communication', 'B.Tech', 4)
ON CONFLICT (id) DO NOTHING;

-- 4. Demo Profiles (Admins, Faculty, Students)
-- Admin
INSERT INTO public.profiles (id, institution_id, full_name, email, role, institutional_id, account_status)
VALUES (
    '10000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Dr. Arthur Vance (Dean)',
    'admin@apex.edu',
    'admin',
    'ADM-001',
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Faculty 1: Dr. Sarah Jenkins (CSE)
INSERT INTO public.profiles (id, institution_id, full_name, email, role, institutional_id, department_id, account_status)
VALUES (
    '10000000-0000-0000-0000-000000000002'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Dr. Sarah Jenkins',
    'sarah.jenkins@apex.edu',
    'faculty',
    'FAC-CSE-01',
    'd0000000-0000-0000-0000-000000000001'::uuid,
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Faculty 2: Prof. David Chen (Mathematics & AI)
INSERT INTO public.profiles (id, institution_id, full_name, email, role, institutional_id, department_id, account_status)
VALUES (
    '10000000-0000-0000-0000-000000000003'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Prof. David Chen',
    'david.chen@apex.edu',
    'faculty',
    'FAC-CSE-02',
    'd0000000-0000-0000-0000-000000000001'::uuid,
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Student 1: Alex Rivera (3rd Year CSE)
INSERT INTO public.profiles (id, institution_id, full_name, email, role, institutional_id, department_id, program_id, academic_year, semester, account_status)
VALUES (
    '10000000-0000-0000-0000-000000000010'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Alex Rivera',
    'alex.rivera@student.apex.edu',
    'student',
    '22CSE1042',
    'd0000000-0000-0000-0000-000000000001'::uuid,
    'b0000000-0000-0000-0000-000000000001'::uuid,
    3,
    5,
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Student 2: Priya Sharma (3rd Year CSE)
INSERT INTO public.profiles (id, institution_id, full_name, email, role, institutional_id, department_id, program_id, academic_year, semester, account_status)
VALUES (
    '10000000-0000-0000-0000-000000000011'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'Priya Sharma',
    'priya.sharma@student.apex.edu',
    'student',
    '22CSE1043',
    'd0000000-0000-0000-0000-000000000001'::uuid,
    'b0000000-0000-0000-0000-000000000001'::uuid,
    3,
    5,
    'active'
) ON CONFLICT (id) DO NOTHING;

-- 5. Demo Courses
INSERT INTO public.courses (id, institution_id, department_id, program_id, faculty_id, course_code, course_name, academic_year, semester, description) VALUES
('c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000002'::uuid, 'CS301', 'Distributed Systems & Cloud Computing', 3, 5, 'Fundamentals of distributed computing, consensus algorithms, cloud infrastructure, and microservices.'),
('c0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000003'::uuid, 'CS305', 'Artificial Intelligence & Neural Networks', 3, 5, 'Heuristic search algorithms, knowledge representation, reinforcement learning, and deep neural networks.'),
('c0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000002'::uuid, 'CS308', 'Database Engineering & Storage Systems', 3, 5, 'Relational internals, B+ Trees, ACID transactions, WAL logging, distributed databases, and vector stores.')
ON CONFLICT (id) DO NOTHING;

-- 6. Demo Enrollments (Alex Rivera enrolled in all 3 courses)
INSERT INTO public.enrollments (id, institution_id, student_id, course_id, enrollment_status) VALUES
('e0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000010'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid, 'active'),
('e0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000010'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid, 'active'),
('e0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000010'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid, 'active')
ON CONFLICT (id) DO NOTHING;

-- 7. Demo Announcements
INSERT INTO public.announcements (id, institution_id, author_id, title, content, category, priority, published, published_at) VALUES
(
    'a1000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'Mid-Semester Examination Schedule Autumn 2026',
    'The Mid-Semester Examinations for all B.Tech 3rd and 5th Semester students will commence from November 24, 2026. Hall tickets will be issued digitally through CAMPUS OS starting November 18. Strict compliance with academic honesty policy is mandated.',
    'examination',
    'high',
    true,
    now() - interval '2 days'
),
(
    'a1000000-0000-0000-0000-000000000002'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000002'::uuid,
    'CS301 Lab Project Submission & Demonstration Guidelines',
    'Distributed Systems Lab Milestone 2 is due this Friday at 11:59 PM. Please submit your GitHub repository links with Docker Compose configuration and architecture diagrams.',
    'academic',
    'normal',
    true,
    now() - interval '1 day'
),
(
    'a1000000-0000-0000-0000-000000000003'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'Annual Apex Hackathon 2026: Registrations Open',
    'Join 500+ student developers across 36 hours of rapid product building. Tracks include Generative AI, Distributed Infrastructure, and Smart Campus Systems. Prize pool of INR 5,00,000.',
    'event',
    'normal',
    true,
    now() - interval '3 hours'
)
ON CONFLICT (id) DO NOTHING;

-- 8. Demo Timetable (Mon to Fri schedule for 3rd Year CSE)
INSERT INTO public.timetables (institution_id, course_id, department_id, academic_year, semester, day_of_week, start_time, end_time, room, faculty_id) VALUES
('a0000000-0000-0000-0000-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 3, 5, 1, '09:00:00', '10:30:00', 'LH-204', '10000000-0000-0000-0000-000000000002'::uuid),
('a0000000-0000-0000-0000-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 3, 5, 1, '11:00:00', '12:30:00', 'CS-Lab 3', '10000000-0000-0000-0000-000000000003'::uuid),
('a0000000-0000-0000-0000-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 3, 5, 2, '10:00:00', '11:30:00', 'LH-201', '10000000-0000-0000-0000-000000000002'::uuid),
('a0000000-0000-0000-0000-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 3, 5, 3, '09:00:00', '10:30:00', 'LH-204', '10000000-0000-0000-0000-000000000002'::uuid),
('a0000000-0000-0000-0000-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 3, 5, 4, '14:00:00', '15:30:00', 'LH-102', '10000000-0000-0000-0000-000000000003'::uuid),
('a0000000-0000-0000-0000-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid, 'd0000000-0000-0000-0000-000000000001'::uuid, 3, 5, 5, '11:00:00', '12:30:00', 'CS-Lab 1', '10000000-0000-0000-0000-000000000002'::uuid);

-- 9. Demo Assignments
INSERT INTO public.assignments (id, institution_id, course_id, faculty_id, title, description, due_at, max_marks) VALUES
(
    'a2000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'c0000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000002'::uuid,
    'Raft Consensus Protocol Implementation',
    'Implement leader election and log replication using Go or TypeScript. Provide unit tests simulating network partition and recovery.',
    now() + interval '5 days',
    100.00
),
(
    'a2000000-0000-0000-0000-000000000002'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'c0000000-0000-0000-0000-000000000002'::uuid,
    '10000000-0000-0000-0000-000000000003'::uuid,
    'Transformer Attention Layer from Scratch',
    'Write a PyTorch implementation of Multi-Head Self Attention without using nn.MultiheadAttention. Benchmark latency against standard matrix multiplication.',
    now() + interval '9 days',
    50.00
)
ON CONFLICT (id) DO NOTHING;

-- 10. Demo Attendance Records for Student Alex Rivera
INSERT INTO public.attendance_records (institution_id, student_id, course_id, attendance_date, status, recorded_by) VALUES
('a0000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000010'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid, (current_date - interval '1 day')::date, 'present', '10000000-0000-0000-0000-000000000002'::uuid),
('a0000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000010'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid, (current_date - interval '2 days')::date, 'present', '10000000-0000-0000-0000-000000000003'::uuid),
('a0000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000010'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid, (current_date - interval '3 days')::date, 'present', '10000000-0000-0000-0000-000000000002'::uuid),
('a0000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000010'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid, (current_date - interval '4 days')::date, 'present', '10000000-0000-0000-0000-000000000002'::uuid),
('a0000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000010'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid, (current_date - interval '5 days')::date, 'absent', '10000000-0000-0000-0000-000000000003'::uuid)
ON CONFLICT (student_id, course_id, attendance_date) DO NOTHING;

-- 11. Demo Events
INSERT INTO public.events (id, institution_id, organizer_id, title, description, category, location, start_at, end_at, capacity, registration_enabled, image_url) VALUES
(
    'e1000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'Apex National AI Symposium 2026',
    'Keynote sessions with distinguished researchers on foundation models, agentic workflows, and ethical artificial intelligence.',
    'seminar',
    'Main Auditorium, West Wing',
    now() + interval '12 days',
    now() + interval '12 days 8 hours',
    350,
    true,
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&fit=crop'
),
(
    'e1000000-0000-0000-0000-000000000002'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000002'::uuid,
    'Apex 36-Hour Hackathon 2026',
    'Build and pitch production-grade software prototypes. Mentors from top tech enterprises on-site.',
    'hackathon',
    'Innovation Center & CSE Labs',
    now() + interval '20 days',
    now() + interval '21 days 12 hours',
    120,
    true,
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&fit=crop'
)
ON CONFLICT (id) DO NOTHING;

-- 12. Demo Campus Locations
INSERT INTO public.campus_locations (id, institution_id, name, category, description, building, floor, latitude, longitude) VALUES
('f0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Central Library & Reading Hall', 'library', 'Three-story library with 50,000+ technical volumes, digital journal terminals, and quiet study pods.', 'Knowledge Tower', 'Ground to 2nd Floor', 12.9716, 77.5946),
('f0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Alan Turing Computing Lab', 'laboratory', 'High-performance GPU cluster lab with 80 RTX 4090 workstations for deep learning & graphics research.', 'Turing Building', '3rd Floor, Room 302', 12.9720, 77.5950),
('f0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Academic Affairs & Dean Office', 'administrative', 'Student administration, enrollment records, transcripts, and faculty affairs.', 'Administrative Block', '1st Floor', 12.9712, 77.5940),
('f0000000-0000-0000-0000-000000000004'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Campus Food Court & Cafe', 'cafeteria', 'Multi-cuisine dining hall with healthy meals, coffee bars, and open-air seating area.', 'Student Activity Center', 'Ground Floor', 12.9725, 77.5960)
ON CONFLICT (id) DO NOTHING;

-- 13. Demo Lost & Found Items
INSERT INTO public.lost_found_items (id, institution_id, reported_by, item_name, description, report_type, category, location_description, status) VALUES
(
    'f1000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000010'::uuid,
    'Navy Blue Lenovo Laptop Charger 65W',
    'Found near Desk 14 in Central Library 2nd Floor reading section.',
    'found',
    'electronics',
    'Central Library 2nd Floor',
    'open'
),
(
    'f1000000-0000-0000-0000-000000000002'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000011'::uuid,
    'Black Leather Wallet with College ID',
    'Lost between Cafeteria and Turing Building walkway on Tuesday afternoon.',
    'lost',
    'accessories',
    'Walkway between Food Court and Turing Building',
    'open'
)
ON CONFLICT (id) DO NOTHING;

-- 14. Demo Support Tickets
INSERT INTO public.support_tickets (id, institution_id, student_id, assigned_to, subject, description, category, priority, status) VALUES
(
    'f2000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000010'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'Request for Elective Course Schedule Clarification',
    'Need confirmation if CS308 Database Engineering overlaps with Neural Networks Lab on Friday.',
    'academic',
    'normal',
    'resolved'
)
ON CONFLICT (id) DO NOTHING;

-- 15. Demo Institutional Document (for RAG testing and demonstration)
INSERT INTO public.documents (id, institution_id, uploaded_by, title, description, category, storage_path, mime_type, file_size, access_scope, processing_status) VALUES
(
    'dc000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'Apex Academic Regulations & Examination Code 2026',
    'Official academic guidelines regarding minimum attendance (75%), grading rubrics, internal assessments, and examination rules.',
    'handbook',
    'documents/apex_academic_code_2026.pdf',
    'application/pdf',
    245760,
    'institution',
    'completed'
)
ON CONFLICT (id) DO NOTHING;

-- Sample document chunk for RAG
INSERT INTO public.document_chunks (id, document_id, institution_id, chunk_index, content, page_number, metadata) VALUES
(
    'c1000000-0000-0000-0000-000000000001'::uuid,
    'dc000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    1,
    'ATTENDANCE REGULATION (Clause 4.2): Every student is required to maintain a minimum of 75% attendance in each registered course to be eligible to appear for the End-Semester Examination. Students with attendance between 65% and 74% with documented medical exigencies may apply for condonation to the Dean of Academic Affairs. Attendance below 65% warrants a non-negotiable course repeat.',
    4,
    '{"section": "4.2", "title": "Attendance Policy", "tags": ["attendance", "eligibility", "condonation"]}'::jsonb
),
(
    'c1000000-0000-0000-0000-000000000002'::uuid,
    'dc000000-0000-0000-0000-000000000001'::uuid,
    'a0000000-0000-0000-0000-000000000001'::uuid,
    2,
    'EXAMINATION & INTERNAL ASSESSMENT (Clause 6.1): The evaluation is split into 50% Continuous Internal Evaluation (CIE) and 50% Semester End Examination (SEE). Continuous evaluation consists of two Mid-Semester Exams (30 marks total), laboratory/project submissions (15 marks), and active class participation/quizzes (5 marks). A minimum score of 40% in SEE and 40% aggregate is required for course credit.',
    7,
    '{"section": "6.1", "title": "Examination & Grading Structure", "tags": ["exam", "grading", "internal_assessment"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

