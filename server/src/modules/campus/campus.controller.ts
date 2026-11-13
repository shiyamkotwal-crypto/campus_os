import { Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

export async function getCampusLocations(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { category, search } = req.query;

  try {
    let query = supabaseAdmin
      .from('campus_locations')
      .select('*')
      .eq('institution_id', user.institution_id);

    if (category) {
      query = query.eq('category', category as string);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query.order('name', { ascending: true });
    if (error) throw error;

    res.json({ locations: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch campus locations' });
  }
}

export async function getLostFound(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { type, status } = req.query;

  try {
    let query = supabaseAdmin
      .from('lost_found_items')
      .select('*, reporter:reported_by(full_name)')
      .eq('institution_id', user.institution_id);

    if (type) {
      query = query.eq('report_type', type as string);
    }
    if (status) {
      query = query.eq('status', status as string);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    // Contact info is protected; only reporter name shown
    const formatted = (data || []).map((item: any) => ({
      ...item,
      is_mine: item.reported_by === user.id,
      reporter_display: item.reported_by === user.id ? 'You' : item.reporter?.full_name || 'Verified Student'
    }));

    res.json({ items: formatted });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch lost and found items' });
  }
}

export async function createLostFound(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { item_name, description, report_type, category, location_description, image_url } = req.body;

  if (!item_name || !report_type || !location_description) {
    res.status(400).json({ error: 'BadRequest', message: 'Missing required report fields' });
    return;
  }

  const allowedCategories = ['electronics', 'stationery', 'clothing', 'identity_card', 'accessories', 'other'];
  const safeCategory = allowedCategories.includes(category) ? category : 'other';

  try {
    const { data, error } = await supabaseAdmin
      .from('lost_found_items')
      .insert({
        institution_id: user.institution_id,
        reported_by: user.id,
        item_name,
        description,
        report_type: report_type === 'found' ? 'found' : 'lost',
        category: safeCategory,
        location_description,
        image_url,
        status: 'open'
      })
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Item report filed successfully', item: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to file lost and found report' });
  }
}

export async function updateLostFoundStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;
  const { status } = req.body;

  try {
    let query = supabaseAdmin
      .from('lost_found_items')
      .update({ status })
      .eq('id', id)
      .eq('institution_id', user.institution_id);

    if (user.role !== 'admin') {
      query = query.eq('reported_by', user.id);
    }

    const { data, error } = await query.select('*').single();
    if (error) throw error;

    res.json({ message: 'Item status updated', item: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to update item report' });
  }
}

