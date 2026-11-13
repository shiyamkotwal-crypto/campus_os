import { Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';
import {
  generateCampusAnswer,
  summarizeDocument,
  extractNoticeInformation,
  generateStudyPlan
} from '../../ai/gemini.js';
import { retrieveRelevantChunks } from '../../ai/rag/retrieval.js';

export async function chat(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { message, sessionId } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'BadRequest', message: 'Message string is required' });
    return;
  }

  try {
    let currentSessionId = sessionId;

    // 1. Ensure or create chat session
    if (!currentSessionId) {
      const { data: newSession, error: sErr } = await supabaseAdmin
        .from('chat_sessions')
        .insert({
          institution_id: user.institution_id,
          user_id: user.id,
          title: message.slice(0, 40) + '...'
        })
        .select('*')
        .single();

      if (!sErr && newSession) {
        currentSessionId = newSession.id;
      }
    }

    // 2. Perform RAG Vector Similarity Retrieval (multi-tenant isolated)
    const retrievedChunks = await retrieveRelevantChunks(
      message,
      user.institution_id,
      user.department_id || undefined,
      0.45,
      4
    );

    // 3. Generate Answer using Gemini Model
    const aiResponse = await generateCampusAnswer(
      message,
      retrievedChunks,
      {
        full_name: user.full_name,
        role: user.role,
        semester: user.semester || undefined
      }
    );

    // 4. Save User Message & Assistant Response in Database if session exists
    if (currentSessionId) {
      await supabaseAdmin.from('chat_messages').insert([
        {
          session_id: currentSessionId,
          user_id: user.id,
          role: 'user',
          content: message
        },
        {
          session_id: currentSessionId,
          user_id: user.id,
          role: 'assistant',
          content: aiResponse.answer,
          citations: aiResponse.sources
        }
      ]);
    }

    res.json({
      sessionId: currentSessionId,
      answer: aiResponse.answer,
      confidence: aiResponse.confidence,
      answer_type: aiResponse.answer_type,
      sources: aiResponse.sources,
      follow_up_question: aiResponse.follow_up_question
    });
  } catch (err: any) {
    console.error('AI chat endpoint error:', err);
    res.status(500).json({ error: 'InternalServerError', message: 'AI processing failed' });
  }
}

export async function getSessions(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  try {
    const { data, error } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json({ sessions: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch chat sessions' });
  }
}

export async function getSessionById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    const { data: session } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!session) {
      res.status(404).json({ error: 'NotFound', message: 'Session not found' });
      return;
    }

    const { data: messages } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('session_id', id)
      .order('created_at', { ascending: true });

    res.json({ session, messages: messages || [] });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch session messages' });
  }
}

export async function deleteSession(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    await supabaseAdmin
      .from('chat_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    res.json({ message: 'Session deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to delete session' });
  }
}

export async function summarize(req: Request, res: Response): Promise<void> {
  const { text, title = 'Campus Document' } = req.body;
  if (!text) {
    res.status(400).json({ error: 'BadRequest', message: 'Document text is required' });
    return;
  }

  const result = await summarizeDocument(text, title);
  res.json({ summary: result });
}

export async function extractNotice(req: Request, res: Response): Promise<void> {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'BadRequest', message: 'Notice text is required' });
    return;
  }

  const result = await extractNoticeInformation(text);
  res.json({ extraction: result });
}

export async function studyPlan(req: Request, res: Response): Promise<void> {
  const { courses = [], assignmentsDue = [], examDates = [], hoursPerDay = 3 } = req.body;
  const plan = await generateStudyPlan(courses, assignmentsDue, examDates, hoursPerDay);
  res.json({ studyPlan: plan });
}

