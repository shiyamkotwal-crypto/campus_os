#!/usr/bin/env python3
"""
CAMPUS OS — Supabase Cloud Database Migration Runner (Python)
Alternative runner for environments with Python 3.
"""

import os
import sys
from pathlib import Path

def main():
    print("=" * 60)
    print("🚀 CAMPUS OS: Supabase Cloud PostgreSQL Migration (Python)")
    print("=" * 60)
    
    current_dir = Path(__file__).resolve().parent
    migration_file = current_dir / "migrations" / "001_initial_schema.sql"
    
    if not migration_file.exists():
        print(f"❌ Migration file not found at: {migration_file}")
        sys.exit(1)
        
    print(f"📄 Found migration file: {migration_file.name} ({migration_file.stat().st_size / 1024:.1f} KB)")
    
    # Check env
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        env_files = [
            current_dir.parent / "server" / ".env",
            current_dir.parent / ".env",
            current_dir / ".env"
        ]
        for env_path in env_files:
            if env_path.exists():
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line.startswith("DATABASE_URL="):
                            db_url = line.split("=", 1)[1].strip().strip('"').strip("'")
                            break
            if db_url:
                break

    if not db_url:
        print("ℹ️ DATABASE_URL not set in environment or .env.")
        print("To apply migrations, set DATABASE_URL or run with node/python once configured.")
        print(f"File location: {migration_file.resolve()}")
        return

    try:
        import psycopg2 # type: ignore
        print("🔗 Connecting to PostgreSQL...")
        conn = psycopg2.connect(db_url, sslmode='require')
        conn.autocommit = True
        with conn.cursor() as cur:
            with open(migration_file, "r", encoding="utf-8") as f:
                cur.execute(f.read())
        conn.close()
        print("🎉 Migration applied successfully!")
    except ImportError:
        print("💡 Note: 'psycopg2' is not installed in current Python env. You can run using the Node.js migration runner:")
        print("   cd supabase && npm install && npm run migrate")
    except Exception as e:
        print(f"❌ Error applying migration: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

