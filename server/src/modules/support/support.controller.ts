import { Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

export async function getTickets(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  try {
    let query = supabaseAdmin
      .from('support_tickets')
      .select('*, student:student_id(full_name, email), assignee:assigned_to(full_name)')
      .eq('institution_id', user.institution_id);

    if (user.role === 'student') {
      query = query.eq('student_id', user.id);
    } else if (user.role === 'faculty') {
      query = query.or(`assigned_to.eq.${user.id},category.eq.academic`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    res.json({ tickets: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch support tickets' });
  }
}

export async function createTicket(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { subject, description, category, priority = 'normal' } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        institution_id: user.institution_id,
        student_id: user.id,
        subject,
        description,
        category,
        priority,
        status: 'open'
      })
      .select('*')
      .single();

    if (error) throw error;

    // Add initial message
    await supabaseAdmin.from('support_ticket_messages').insert({
      ticket_id: data.id,
      sender_id: user.id,
      message: description
    });

    res.status(201).json({ message: 'Support ticket submitted successfully', ticket: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to create support ticket' });
  }
}

export async function getTicketById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    const { data: ticket, error: tErr } = await supabaseAdmin
      .from('support_tickets')
      .select('*, student:student_id(full_name, email), assignee:assigned_to(full_name)')
      .eq('id', id)
      .eq('institution_id', user.institution_id)
      .single();

    if (tErr || !ticket) {
      res.status(404).json({ error: 'NotFound', message: 'Ticket not found' });
      return;
    }

    const { data: messages } = await supabaseAdmin
      .from('support_ticket_messages')
      .select('*, sender:sender_id(full_name, role)')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true });

    res.json({ ticket, messages: messages || [] });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch ticket details' });
  }
}

export async function addTicketMessage(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;
  const { message, attachment_url } = req.body;

  if (!message) {
    res.status(400).json({ error: 'BadRequest', message: 'Message content required' });
    return;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('support_ticket_messages')
      .insert({
        ticket_id: id,
        sender_id: user.id,
        message,
        attachment_url
      })
      .select('*, sender:sender_id(full_name, role)')
      .single();

    if (error) throw error;

    await supabaseAdmin
      .from('support_tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id);

    res.status(201).json({ message: 'Reply sent', entry: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to send message' });
  }
}

export async function updateTicketStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;
  const { status, assigned_to } = req.body;

  try {
    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (assigned_to) updatePayload.assigned_to = assigned_to;

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .update(updatePayload)
      .eq('id', id)
      .eq('institution_id', user.institution_id)
      .select('*')
      .single();

    if (error) throw error;

    res.json({ message: 'Ticket status updated', ticket: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to update ticket status' });
  }
}

