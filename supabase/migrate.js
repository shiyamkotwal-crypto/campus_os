/**
 * CAMPUS OS — Supabase Cloud Database Migration Runner
 * 
 * Applies `/supabase/migrations/001_initial_schema.sql` to Supabase PostgreSQL
 * using either:
 *  1. Direct connection string `DATABASE_URL` (recommended for full DDL, RLS, and vector)
 *  2. Supabase Management / SQL API using SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env, .env, or process environment
const envPaths = [
  path.resolve(__dirname, '../server/.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '.env')
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 CAMPUS OS: Supabase Cloud PostgreSQL Migration');
  console.log('====================================================\n');

  const migrationFilePath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
  if (!fs.existsSync(migrationFilePath)) {
    console.error(`❌ Migration file not found at: ${migrationFilePath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(migrationFilePath, 'utf8');
  console.log(`📄 Read migration file: 001_initial_schema.sql (${(sqlContent.length / 1024).toFixed(1)} KB)`);

  if (DATABASE_URL) {
    console.log(`🔗 Connecting to PostgreSQL using DATABASE_URL...`);
    const client = new pg.Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log('✅ Connected to database successfully.');
      console.log('⏳ Executing migration scripts, RLS policies, and seed data...');

      await client.query(sqlContent);

      console.log('🎉 Migration applied successfully!');
      
      // Verification query
      const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      
      console.log(`\n📊 Verified ${res.rows.length} public tables in database:`);
      res.rows.forEach(r => console.log(`   - ${r.table_name}`));

      await client.end();
      process.exit(0);
    } catch (err) {
      console.error('\n❌ Migration execution failed:');
      console.error(err.message);
      if (err.position) console.error(`   Error at position: ${err.position}`);
      await client.end().catch(() => {});
      process.exit(1);
    }
  } else if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    console.log(`📡 DATABASE_URL not set, but SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY detected.`);
    console.log(`   To execute custom DDL, RLS, and vector extensions, please provide the direct`);
    console.log(`   PostgreSQL connection string (DATABASE_URL) from your Supabase Dashboard:`);
    console.log(`   Settings -> Database -> Connection String -> URI (Session Pooler or Direct)`);
    console.log(`\nExample:`);
    console.log(`   DATABASE_URL="postgres://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"`);
    console.log(`\nAlternatively, you can copy the contents of /supabase/migrations/001_initial_schema.sql`);
    console.log(`directly into the Supabase Web Dashboard SQL Editor and click "Run".`);
    process.exit(1);
  } else {
    console.error('❌ Missing database credentials.');
    console.error('   Please provide DATABASE_URL in server/.env or environment variables.');
    console.error('   Example: DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"');
    process.exit(1);
  }
}

runMigration().catch((err) => {
  console.error('Unhandled fatal error in migration runner:', err);
  process.exit(1);
});

