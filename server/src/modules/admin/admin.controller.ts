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

