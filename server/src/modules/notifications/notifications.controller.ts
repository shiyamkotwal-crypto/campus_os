import { Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

export async function getNotifications(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;

    const unreadCount = (data || []).filter((n: any) => !n.read_at).length;
    res.json({ notifications: data || [], unread_count: unreadCount });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch notifications' });
  }
}

export async function markAsRead(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    await supabaseAdmin
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    res.json({ message: 'Notification marked as read' });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to update notification' });
  }
}

export async function markAllAsRead(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  try {
    await supabaseAdmin
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('read_at', null);

    res.json({ message: 'All notifications marked as read' });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to update notifications' });
  }
}

