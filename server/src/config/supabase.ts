import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import WebSocket from 'ws';
import { env } from './env.js';

// Polyfill WebSocket for Node runtime if not present
if (typeof (globalThis as any).WebSocket === 'undefined') {
  (globalThis as any).WebSocket = WebSocket;
}

// Supabase client with anon key (respects RLS)
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

// Supabase admin client with service-role key (used for server-side auth, indexing, background processing)
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Optional direct pg Pool for pgvector queries and atomic migrations
export const dbPool = env.DATABASE_URL
  ? new pg.Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    })
  : null;
