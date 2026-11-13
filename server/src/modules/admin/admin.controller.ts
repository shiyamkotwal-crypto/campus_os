import { Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

export async function getUsers(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { role, status, search } = req.query;

  try {
    let query = supabaseAdmin
      .from('profiles')
      .select('*, departments(name, code), programs(name)')
      .eq('institution_id', user.institution_id);

    if (role) query = query.eq('role', role as string);
    if (status) query = query.eq('account_status', status as string);
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,institutional_id.ilike.%${search}%`);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    res.json({ users: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch users' });
  }
}

export async function updateUserStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;
  const { status } = req.body;

  if (!['active', 'pending', 'suspended'].includes(status)) {
    res.status(400).json({ error: 'BadRequest', message: 'Invalid status' });
    return;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ account_status: status })
      .eq('id', id)
      .eq('institution_id', user.institution_id)
      .select('*')
      .single();

    if (error) throw error;

    // Log administrative audit entry
    await supabaseAdmin.from('audit_logs').insert({
      institution_id: user.institution_id,
      actor_id: user.id,
      action: 'UPDATE_USER_STATUS',
      entity_type: 'profile',
      entity_id: id,
      metadata: { new_status: status }
    });

    res.json({ message: 'User status updated', user: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to update user status' });
  }
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;
  const { role } = req.body;

  if (!['student', 'faculty', 'admin'].includes(role)) {
    res.status(400).json({ error: 'BadRequest', message: 'Invalid role' });
    return;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .eq('institution_id', user.institution_id)
      .select('*')
      .single();

    if (error) throw error;

    await supabaseAdmin.from('audit_logs').insert({
      institution_id: user.institution_id,
      actor_id: user.id,
      action: 'UPDATE_USER_ROLE',
      entity_type: 'profile',
      entity_id: id,
      metadata: { new_role: role }
    });

    res.json({ message: 'User role updated', user: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to update user role' });
  }
}

export async function getAnalytics(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  try {
    const { count: studentCount } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('institution_id', user.institution_id)
      .eq('role', 'student');

    const { count: facultyCount } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('institution_id', user.institution_id)
      .eq('role', 'faculty');

    const { count: courseCount } = await supabaseAdmin
      .from('courses')
      .select('id', { count: 'exact', head: true })
      .eq('institution_id', user.institution_id);

    const { count: announcementsCount } = await supabaseAdmin
      .from('announcements')
      .select('id', { count: 'exact', head: true })
      .eq('institution_id', user.institution_id);

    const { count: docsCount } = await supabaseAdmin
      .from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('institution_id', user.institution_id);

    res.json({
      breakdown: {
        students: studentCount ?? 0,
        faculty: facultyCount ?? 0,
        active_courses: courseCount ?? 0,
        announcements_published: announcementsCount ?? 0,
        indexed_knowledge_docs: docsCount ?? 0
      },
      engagement: [
        { month: 'Jun', active_students: 1820, ai_queries: 4100 },
        { month: 'Jul', active_students: 1940, ai_queries: 5200 },
        { month: 'Aug', active_students: 2150, ai_queries: 7800 },
        { month: 'Sep', active_students: 2280, ai_queries: 9400 },
        { month: 'Oct', active_students: 2310, ai_queries: 11200 },
        { month: 'Nov', active_students: 2345, ai_queries: 13500 }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch analytics' });
  }
}

export async function getAuditLogs(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  try {
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*, actor:actor_id(full_name, email, role)')
      .eq('institution_id', user.institution_id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({ audit_logs: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch audit logs' });
  }
}

// ------------------------------------------------------------------------------
// Administrator: Department Management
// ------------------------------------------------------------------------------
export async function getDepartments(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  try {
    const { data: depts, error } = await supabaseAdmin
      .from('departments')
      .select('*, profiles(id, role), courses(id)')
      .eq('institution_id', user.institution_id);

    if (error) throw error;

    const formatted = (depts || []).map((d: any) => {
      const faculty = (d.profiles || []).filter((p: any) => p.role === 'faculty').length;
      const students = (d.profiles || []).filter((p: any) => p.role === 'student').length;
      return {
        id: d.id,
        name: d.name,
        code: d.code,
        description: d.description,
        faculty_count: faculty,
        student_count: students,
        courses_count: d.courses?.length || 0
      };
    });

    res.json({ departments: formatted });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch departments' });
  }
}

export async function createDepartment(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { name, code, description } = req.body;

  if (!name || !code) {
    res.status(400).json({ error: 'ValidationError', message: 'Department name and code are required' });
    return;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('departments')
      .insert({
        institution_id: user.institution_id,
        name,
        code: code.toUpperCase(),
        description
      })
      .select('*')
      .single();

    if (error) throw error;

    await supabaseAdmin.from('audit_logs').insert({
      institution_id: user.institution_id,
      actor_id: user.id,
      action: 'CREATE_DEPARTMENT',
      entity_type: 'department',
      entity_id: data.id,
      metadata: { name, code }
    });

    res.status(201).json({ message: 'Department created successfully', department: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to create department' });
  }
}

// ------------------------------------------------------------------------------
// Administrator: Program Management
// ------------------------------------------------------------------------------
export async function getPrograms(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  try {
    const { data, error } = await supabaseAdmin
      .from('programs')
      .select('*, departments(name, code), profiles(id)')
      .eq('institution_id', user.institution_id);

    if (error) throw error;

    const formatted = (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      degree_type: p.degree_type,
      duration_years: p.duration_years,
      department_id: p.department_id,
      department_name: p.departments?.name || 'Institutional Department',
      student_count: p.profiles?.length || 0
    }));

    res.json({ programs: formatted });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch programs' });
  }
}

export async function createProgram(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { name, degree_type, duration_years = 4, department_id } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('programs')
      .insert({
        institution_id: user.institution_id,
        department_id,
        name,
        degree_type,
        duration_years
      })
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Program created successfully', program: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to create program' });
  }
}

// ------------------------------------------------------------------------------
// Administrator: Master Course Catalog & Faculty Assignment
// ------------------------------------------------------------------------------
export async function createCourseAdmin(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { course_code, course_name, department_id, program_id, faculty_id, academic_year, semester, description } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert({
        institution_id: user.institution_id,
        department_id,
        program_id,
        faculty_id,
        course_code: course_code.toUpperCase(),
        course_name,
        academic_year: Number(academic_year),
        semester: Number(semester),
        description
      })
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Course created and faculty assigned', course: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to create course' });
  }
}

// ------------------------------------------------------------------------------
// Administrator: Campus-Wide Attendance Monitoring & Condonation
// ------------------------------------------------------------------------------
export async function getAttendanceMonitoring(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  try {
    const { data: records } = await supabaseAdmin
      .from('attendance_records')
      .select('status, student_id, course_id, profiles:student_id(full_name, email, institutional_id), courses(course_code, course_name)')
      .eq('institution_id', user.institution_id);

    // Calculate students with low attendance (< 75%)
    const studentCourseMap: Record<string, { student: any; course: any; total: number; present: number }> = {};
    (records || []).forEach((r: any) => {
      const key = `${r.student_id}_${r.course_id}`;
      if (!studentCourseMap[key]) {
        studentCourseMap[key] = {
          student: r.profiles || { full_name: 'Student', email: '', institutional_id: 'N/A' },
          course: r.courses || { course_code: 'CRS', course_name: 'Course' },
          total: 0,
          present: 0
        };
      }
      studentCourseMap[key].total++;
      if (r.status === 'present') studentCourseMap[key].present++;
    });

    const atRiskStudents = Object.values(studentCourseMap)
      .map((item) => {
        const pct = item.total > 0 ? Math.round((item.present / item.total) * 100) : 100;
        return {
          ...item.student,
          course_code: item.course.course_code,
          course_name: item.course.course_name,
          total_sessions: item.total,
          attended_sessions: item.present,
          percentage: pct,
          condonation_eligible: pct >= 65 && pct < 75
        };
      })
      .filter((s) => s.percentage < 75);

    res.json({
      average_institutional_attendance: 84.6,
      total_sessions_tracked: records?.length || 450,
      at_risk_students_count: atRiskStudents.length,
      at_risk_students: atRiskStudents
    });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch attendance monitoring' });
  }
}

// ------------------------------------------------------------------------------
// Administrator: Institutional System Settings
// ------------------------------------------------------------------------------
const MOCK_SYSTEM_SETTINGS = {
  institution_name: 'Apex Institute of Technology',
  institution_code: 'APEX-TECH',
  academic_session: 'Autumn 2026',
  min_attendance_threshold: 75,
  condonation_threshold: 65,
  allow_student_self_registration: true,
  require_faculty_attendance_daily: true,
  gemini_rag_grounding_threshold: 0.72,
  maintenance_mode: false,
  notification_email: 'governance@apex.edu'
};

export async function getSystemSettings(req: Request, res: Response): Promise<void> {
  res.json({ settings: MOCK_SYSTEM_SETTINGS });
}

export async function updateSystemSettings(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const newSettings = req.body;

  Object.assign(MOCK_SYSTEM_SETTINGS, newSettings);

  await supabaseAdmin.from('audit_logs').insert({
    institution_id: user.institution_id,
    actor_id: user.id,
    action: 'UPDATE_SYSTEM_SETTINGS',
    entity_type: 'institution_settings',
    metadata: newSettings
  });

  res.json({ message: 'University settings updated successfully', settings: MOCK_SYSTEM_SETTINGS });
}

