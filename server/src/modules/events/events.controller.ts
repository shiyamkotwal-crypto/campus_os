import { Request, Response } from 'express';
import { supabaseAdmin, dbPool } from '../../config/supabase.js';

export async function getEvents(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  try {
    const { data: events, error } = await supabaseAdmin
      .from('events')
      .select('*, profiles:organizer_id(full_name), registrations:event_registrations(id, student_id, status)')
      .eq('institution_id', user.institution_id)
      .order('start_at', { ascending: true });

    if (error) throw error;

    const formatted = (events || []).map((e: any) => {
      const activeRegs = (e.registrations || []).filter((r: any) => r.status === 'registered');
      const isRegistered = activeRegs.some((r: any) => r.student_id === user.id);
      return {
        ...e,
        current_registrations: activeRegs.length,
        is_registered: isRegistered,
        organizer_name: e.profiles?.full_name || 'Campus Events Board'
      };
    });

    res.json({ events: formatted });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch campus events' });
  }
}

export async function createEvent(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { title, description, category, location, start_at, end_at, capacity = 100, image_url } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .insert({
        institution_id: user.institution_id,
        organizer_id: user.id,
        title,
        description,
        category,
        location,
        start_at,
        end_at,
        capacity,
        image_url
      })
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Event created successfully', event: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to create event' });
  }
}

export async function registerForEvent(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    // 1. Try invoking atomic RPC procedure
    if (dbPool) {
      const result = await dbPool.query('SELECT public.register_for_event_atomic($1, $2) as res;', [id, user.id]);
      const outcome = result.rows[0]?.res;
      if (!outcome?.success) {
        res.status(400).json({ error: 'RegistrationFailed', message: outcome?.error || 'Registration failed' });
        return;
      }
      res.json(outcome);
      return;
    }

    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('register_for_event_atomic', {
      p_event_id: id,
      p_student_id: user.id
    });

    if (!rpcError && rpcData) {
      if (!rpcData.success) {
        res.status(400).json({ error: 'RegistrationFailed', message: rpcData.error });
        return;
      }
      res.json(rpcData);
      return;
    }

    // 2. Direct transactional check fallback
    const { data: existing } = await supabaseAdmin
      .from('event_registrations')
      .select('id')
      .eq('event_id', id)
      .eq('student_id', user.id)
      .single();

    if (existing) {
      res.status(400).json({ error: 'AlreadyRegistered', message: 'You are already registered for this event' });
      return;
    }

    const { data: newReg, error: insError } = await supabaseAdmin
      .from('event_registrations')
      .insert({
        event_id: id,
        student_id: user.id,
        status: 'registered'
      })
      .select('*')
      .single();

    if (insError) throw insError;

    res.status(201).json({ success: true, message: 'Successfully registered for event', registration: newReg });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Event registration failed' });
  }
}

export async function cancelRegistration(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    await supabaseAdmin
      .from('event_registrations')
      .delete()
      .eq('event_id', id)
      .eq('student_id', user.id);

    res.json({ message: 'Event registration cancelled' });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to cancel registration' });
  }
}

