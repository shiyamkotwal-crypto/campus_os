import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase.js';
import { env } from '../config/env.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'faculty' | 'admin';
  institution_id: string;
  department_id?: string | null;
  department_name?: string | null;
  program_id?: string | null;
  program_name?: string | null;
  institutional_id?: string | null;
  academic_year?: number | null;
  semester?: number | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header'
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. First attempt verifying with Supabase Auth
    const { data: { user: sbUser }, error: sbError } = await supabaseAdmin.auth.getUser(token);

    let userId: string | null = null;
    let userEmail: string | null = null;

    if (sbUser && !sbError) {
      userId = sbUser.id;
      userEmail = sbUser.email || null;
    } else {
      // 2. Fallback: Verify standard signed JWT (used by internal session or development tokens)
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as any;
        userId = decoded.sub || decoded.id;
        userEmail = decoded.email;
      } catch (jwtErr) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid or expired session token'
        });
        return;
      }
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized', message: 'User identification failed' });
      return;
    }

    // 3. Fetch full profile and institutional affiliation from PostgreSQL
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*, departments(name, code), programs(name, degree_type)')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      res.status(401).json({ error: 'Unauthorized', message: 'User profile not found in institution database' });
      return;
    }

    if (profile.account_status === 'suspended') {
      res.status(403).json({ error: 'Forbidden', message: 'Your account has been suspended by administration' });
      return;
    }

    const dept = (profile as any).departments;
    const prog = (profile as any).programs;

    req.user = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      institution_id: profile.institution_id,
      department_id: profile.department_id,
      department_name: dept?.name || null,
      program_id: profile.program_id,
      program_name: prog?.name || null,
      institutional_id: profile.institutional_id || null,
      academic_year: profile.academic_year,
      semester: profile.semester
    };

    next();
  } catch (err: any) {
    console.error('Authentication middleware error:', err);
    res.status(500).json({ error: 'InternalServerError', message: 'Authentication verification failed' });
  }
}

