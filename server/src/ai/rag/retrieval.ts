import { dbPool, supabaseAdmin } from '../../config/supabase.js';
import { generateEmbedding } from '../gemini.js';

export interface RetrievedChunk {
  id: string;
  document_id: string;
  document_title: string;
  content: string;
  page_number?: number | null;
  metadata?: any;
  similarity: number;
}

/**
 * Retrieves relevant institutional document chunks using vector cosine similarity
 * strictly bounded by the user's institution and departmental scope.
 */
export async function retrieveRelevantChunks(
  query: string,
  institutionId: string,
  departmentId?: string,
  threshold: number = 0.45,
  limit: number = 5
): Promise<RetrievedChunk[]> {
  try {
    const queryEmbedding = await generateEmbedding(query);
    const vectorString = `[${queryEmbedding.join(',')}]`;

    // 1. If direct Postgres Pool is available, execute stored procedure
    if (dbPool) {
      const sql = `
        SELECT * FROM public.match_document_chunks(
          $1::vector(768),
          $2::uuid,
          $3::float,
          $4::int,
          $5::uuid
        );
      `;
      const res = await dbPool.query(sql, [
        vectorString,
        institutionId,
        threshold,
        limit,
        departmentId || null
      ]);
      return res.rows;
    }

    // 2. Alternatively, invoke RPC via Supabase Admin Client
    const { data, error } = await supabaseAdmin.rpc('match_document_chunks', {
      p_query_embedding: queryEmbedding,
      p_institution_id: institutionId,
      p_match_threshold: threshold,
      p_match_count: limit,
      p_department_id: departmentId || null
    });

    if (error) {
      console.warn('RPC match_document_chunks error:', error.message);
      // Fallback: Text ILIKE search on document_chunks if vector index is empty
      const { data: textFallback } = await supabaseAdmin
        .from('document_chunks')
        .select('id, document_id, content, page_number, metadata, documents(title)')
        .eq('institution_id', institutionId)
        .ilike('content', `%${query.split(' ')[0]}%`)
        .limit(limit);

      if (textFallback && textFallback.length > 0) {
        return textFallback.map((row: any) => ({
          id: row.id,
          document_id: row.document_id,
          document_title: row.documents?.title || 'Institutional Document',
          content: row.content,
          page_number: row.page_number,
          metadata: row.metadata,
          similarity: 0.8
        }));
      }
      return [];
    }

    return (data as RetrievedChunk[]) || [];
  } catch (err) {
    console.error('Error in retrieveRelevantChunks:', err);
    return [];
  }
}

