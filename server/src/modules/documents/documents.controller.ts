import { Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';
import { generateEmbedding } from '../../ai/gemini.js';

export async function getDocuments(req: Request, res: Response): Promise<void> {
  const user = req.user!;

  try {
    let query = supabaseAdmin
      .from('documents')
      .select('*, profiles:uploaded_by(full_name)')
      .eq('institution_id', user.institution_id);

    if (user.role === 'student') {
      // Students see public, institution-wide, or department-scoped
      query = query.or(`access_scope.eq.public,access_scope.eq.institution,and(access_scope.eq.department,department_id.eq.${user.department_id || 'null'})`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    res.json({ documents: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch documents' });
  }
}

export async function getDocumentById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*, document_chunks(id, chunk_index, content, page_number)')
      .eq('id', id)
      .eq('institution_id', user.institution_id)
      .single();

    if (error || !data) {
      res.status(404).json({ error: 'NotFound', message: 'Document not found' });
      return;
    }

    res.json({ document: data });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to fetch document' });
  }
}

export async function uploadDocument(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { title, description, category, access_scope = 'institution', department_id, raw_content } = req.body;

  try {
    const { data: doc, error } = await supabaseAdmin
      .from('documents')
      .insert({
        institution_id: user.institution_id,
        uploaded_by: user.id,
        title,
        description,
        category,
        storage_path: `documents/${Date.now()}_${title.replace(/\s+/g, '_')}.txt`,
        mime_type: 'text/plain',
        file_size: raw_content?.length || 1024,
        access_scope,
        department_id: department_id || null,
        processing_status: 'pending'
      })
      .select('*')
      .single();

    if (error) throw error;

    // If raw_content is provided, immediately process chunks and embeddings
    if (raw_content && typeof raw_content === 'string') {
      const chunks = chunkText(raw_content, 500);
      for (let i = 0; i < chunks.length; i++) {
        const embedding = await generateEmbedding(chunks[i]);
        await supabaseAdmin.from('document_chunks').insert({
          document_id: doc.id,
          institution_id: user.institution_id,
          chunk_index: i + 1,
          content: chunks[i],
          page_number: Math.floor(i / 2) + 1,
          embedding
        });
      }

      await supabaseAdmin
        .from('documents')
        .update({ processing_status: 'completed' })
        .eq('id', doc.id);
    }

    res.status(201).json({ message: 'Document uploaded and registered', document: doc });
  } catch (err: any) {
    console.error('Upload document error:', err);
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to upload document' });
  }
}

export async function processDocument(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;
  const { content } = req.body;

  try {
    if (!content) {
      res.status(400).json({ error: 'BadRequest', message: 'Document content required for processing' });
      return;
    }

    const chunks = chunkText(content, 400);
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);
      await supabaseAdmin.from('document_chunks').insert({
        document_id: id,
        institution_id: user.institution_id,
        chunk_index: i + 1,
        content: chunks[i],
        page_number: 1,
        embedding
      });
    }

    await supabaseAdmin
      .from('documents')
      .update({ processing_status: 'completed' })
      .eq('id', id);

    res.json({ message: `Successfully processed and indexed ${chunks.length} chunks into vector store` });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to process document' });
  }
}

export async function deleteDocument(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = req.user!;

  try {
    await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('institution_id', user.institution_id);

    res.json({ message: 'Document deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to delete document' });
  }
}

function chunkText(text: string, chunkSize: number = 400): string[] {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    if ((current + ' ' + para).length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? '\n\n' : '') + para;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks.length > 0 ? chunks : [text];
}

