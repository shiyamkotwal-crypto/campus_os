import { Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

export async function getAcademicOverview(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  try {
    const { data: enrollments } = await supabaseAdmin
      .from('enrollments')
      .select('course_id, enrollment_status, courses(*, profiles:faculty_id(full_name))')
      .eq('student_id', user.id);

    res.json({
      student_info: {
        full_name: user.full_name,
        semester: user.semester || 5,
        academic_year: user.academic_year || 3
      },
      enrolled_courses: (enrollments || []).map((e: any) => ({
        ...e.courses,
        status: e.enrollment_status,
        faculty_name: e.courses?.profiles?.full_name || 'Assigned Faculty'
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch academic overview' });
  }
}

export async function getTimetable(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const institutionId = user.institution_id;

  try {
    let query = supabaseAdmin
      .from('timetables')
      .select('id, day_of_week, start_time, end_time, room, courses(id, course_code, course_name), profiles:faculty_id(full_name)')
      .eq('institution_id', institutionId);

    if (user.role === 'student' && user.semester) {
      query = query.eq('semester', user.semester);
    } else if (user.role === 'faculty') {
      query = query.eq('faculty_id', user.id);
    }

    const { data, error } = await query.order('day_of_week', { ascending: true }).order('start_time', { ascending: true });

    if (error) throw error;

    res.json({ timetable: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch timetable' });
  }
}

export async function getAssignments(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const institutionId = user.institution_id;

  try {
    let query = supabaseAdmin
      .from('assignments')
      .select('*, courses(course_code, course_name), assignment_submissions(id, student_id, status, marks, submission_url, submitted_at)')
      .eq('institution_id', institutionId);

    if (user.role === 'faculty') {
      query = query.eq('faculty_id', user.id);
    }

    const { data, error } = await query.order('due_at', { ascending: true });
    if (error) throw error;

    // If student, attach their specific submission status
    const formatted = (data || []).map((assignment: any) => {
      const studentSub = assignment.assignment_submissions?.find((s: any) => s.student_id === user.id);
      return {
        ...assignment,
        my_submission: studentSub || null
      };
    });

    res.json({ assignments: formatted });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch assignments' });
  }
}

export async function createAssignment(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { course_id, title, description, due_at, attachment_url, max_marks = 100 } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('assignments')
      .insert({
        institution_id: user.institution_id,
        course_id,
        faculty_id: user.id,
        title,
        description,
        due_at,
        attachment_url,
        max_marks
      })
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Assignment created successfully', assignment: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to create assignment' });
  }
}

export async function submitAssignment(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { assignment_id, submission_url, feedback } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('assignment_submissions')
      .upsert({
        assignment_id,
        student_id: user.id,
        submission_url,
        feedback,
        submitted_at: new Date().toISOString(),
        status: 'submitted'
      }, { onConflict: 'assignment_id,student_id' })
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Assignment submitted successfully', submission: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to submit assignment' });
  }
}

export async function getAttendance(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  try {
    const { data: records, error } = await supabaseAdmin
      .from('attendance_records')
      .select('*, courses(course_code, course_name)')
      .eq('student_id', user.id)
      .order('attendance_date', { ascending: false });

    if (error) throw error;

    // Calculate aggregated course-level breakdown
    const courseMap: Record<string, { code: string; name: string; total: number; present: number }> = {};
    (records || []).forEach((r: any) => {
      const cId = r.course_id;
      if (!courseMap[cId]) {
        courseMap[cId] = {
          code: r.courses?.course_code || 'CRS',
          name: r.courses?.course_name || 'Course',
          total: 0,
          present: 0
        };
      }
      courseMap[cId].total++;
      if (r.status === 'present') {
        courseMap[cId].present++;
      }
    });

    const summary = Object.values(courseMap).map((c) => ({
      course_code: c.code,
      course_name: c.name,
      total_sessions: c.total,
      attended_sessions: c.present,
      percentage: c.total > 0 ? Math.round((c.present / c.total) * 100) : 100
    }));

    res.json({
      records: records || [],
      summary
    });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch attendance records' });
  }
}

export async function getCourses(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const institutionId = user.institution_id;

  try {
    let query = supabaseAdmin
      .from('courses')
      .select('*, profiles:faculty_id(full_name), enrollments(id), timetables(day_of_week, start_time, end_time, room)')
      .eq('institution_id', institutionId);

    if (user.role === 'faculty') {
      query = query.eq('faculty_id', user.id);
    }

    const { data: courses, error } = await query.order('course_code', { ascending: true });
    if (error) throw error;

    const formatted = (courses || []).map((c: any) => {
      const times = (c.timetables || []).map((t: any) => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const day = dayNames[t.day_of_week] || 'Day';
        const start = t.start_time?.slice(0, 5) || '';
        return `${day} ${start}`;
      });

      const primaryRoom = c.timetables?.[0]?.room || 'Campus Hall';

      return {
        id: c.id,
        code: c.course_code,
        name: c.course_name,
        description: c.description,
        credits: c.credits,
        semester: c.semester,
        year: c.academic_year,
        faculty_name: c.profiles?.full_name || 'Assigned Faculty',
        students: c.enrollments?.length || 0,
        hall: primaryRoom,
        time: times.length > 0 ? times.join(', ') : 'Schedule Pending'
      };
    });

    res.json({ courses: formatted });
  } catch (err: any) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch courses' });
  }
}


