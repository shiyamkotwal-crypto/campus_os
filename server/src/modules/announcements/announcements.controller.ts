import { Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

export async function getAnnouncements(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { category, priority, search } = req.query;

  try {
    let query = supabaseAdmin
      .from('announcements')
      .select('*, profiles:author_id(full_name, role), reads:announcement_reads(id, user_id)')
      .eq('institution_id', user.institution_id);

    // If student, only show published
    if (user.role === 'student') {
      query = query.eq('published', true);
    }

    if (category) {
      query = query.eq('category', category as string);
    }
    if (priority) {
      query = query.eq('priority', priority as string);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Map read status for the current user
    const formatted = (data || []).map((item: any) => ({
      ...item,
      author_name: item.profiles?.full_name || 'Administration',
      is_read: item.reads?.some((r: any) => r.user_id === user.id) || false
    }));

    res.json({ announcements: formatted });
  } catch (err: any) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch announcements' });
  }
}

export async function getAnnouncementById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .select('*, profiles:author_id(full_name, role)')
      .eq('id', id)
      .eq('institution_id', user.institution_id)
      .single();

    if (error || !data) {
      res.status(404).json({ error: 'NotFound', message: 'Announcement not found' });
      return;
    }

    res.json({ announcement: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch announcement' });
  }
}

export async function createAnnouncement(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { title, content, category, priority = 'normal', target_departments, target_academic_years, target_semesters, published = true, expires_at } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .insert({
        institution_id: user.institution_id,
        author_id: user.id,
        title,
        content,
        category,
        priority,
        target_departments: target_departments || [],
        target_academic_years: target_academic_years || [],
        target_semesters: target_semesters || [],
        published,
        published_at: published ? new Date().toISOString() : null,
        expires_at: expires_at || null
      })
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Announcement created successfully', announcement: data });
  } catch (err: any) {
    console.error('Create announcement error:', err);
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to create announcement' });
  }
}

export async function updateAnnouncement(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    let query = supabaseAdmin
      .from('announcements')
      .update({
        ...req.body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('institution_id', user.institution_id);

    if (user.role !== 'admin') {
      query = query.eq('author_id', user.id);
    }

    const { data, error } = await query.select('*').single();
    if (error) throw error;

    res.json({ message: 'Announcement updated successfully', announcement: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to update announcement' });
  }
}

export async function deleteAnnouncement(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    let query = supabaseAdmin
      .from('announcements')
      .delete()
      .eq('id', id)
      .eq('institution_id', user.institution_id);

    if (user.role !== 'admin') {
      query = query.eq('author_id', user.id);
    }

    const { error } = await query;
    if (error) throw error;

    res.json({ message: 'Announcement deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to delete announcement' });
  }
}

export async function markAsRead(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    await supabaseAdmin
      .from('announcement_reads')
      .upsert({
        announcement_id: id,
        user_id: user.id,
        read_at: new Date().toISOString()
      }, { onConflict: 'announcement_id,user_id' });

    res.json({ message: 'Marked as read' });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to mark as read' });
  }
}

