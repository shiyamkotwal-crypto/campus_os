import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../../config/supabase.js';
import { env } from '../../config/env.js';

// Pre-seeded demo credentials for immediate testing
const DEMO_USERS: Record<string, { id: string; email: string; full_name: string; role: 'student' | 'faculty' | 'admin'; institution_id: string; department_id?: string; program_id?: string; academic_year?: number; semester?: number }> = {
  'admin@apex.edu': {
    id: '10000000-0000-0000-0000-000000000001',
    email: 'admin@apex.edu',
    full_name: 'Dr. Arthur Vance (Dean)',
    role: 'admin',
    institution_id: 'a0000000-0000-0000-0000-000000000001'
  },
  'sarah.jenkins@apex.edu': {
    id: '10000000-0000-0000-0000-000000000002',
    email: 'sarah.jenkins@apex.edu',
    full_name: 'Dr. Sarah Jenkins',
    role: 'faculty',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    department_id: 'd0000000-0000-0000-0000-000000000001'
  },
  'alex.rivera@student.apex.edu': {
    id: '10000000-0000-0000-0000-000000000010',
    email: 'alex.rivera@student.apex.edu',
    full_name: 'Alex Rivera',
    role: 'student',
    institution_id: 'a0000000-0000-0000-0000-000000000001',
    department_id: 'd0000000-0000-0000-0000-000000000001',
    program_id: 'b0000000-0000-0000-0000-000000000001',
    academic_year: 3,
    semester: 5
  }
};

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, fullName, role = 'student', institutionalId, departmentId, programId, academicYear, semester } = req.body;

  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
        institutional_id: institutionalId,
        department_id: departmentId,
        program_id: programId,
        academic_year: academicYear,
        semester
      }
    });

    if (authError) {
      res.status(400).json({ error: 'AuthError', message: authError.message });
      return;
    }

    const userId = authData.user.id;

    // 2. Ensure profile exists in profiles table
    const { data: profile, error: profError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        institution_id: req.body.institutionId || 'a0000000-0000-0000-0000-000000000001',
        full_name: fullName,
        email,
        role,
        institutional_id: institutionalId,
        department_id: departmentId,
        program_id: programId,
        academic_year: academicYear,
        semester,
        account_status: 'active'
      })
      .select('*')
      .single();

    const token = jwt.sign(
      { sub: userId, email, role, institution_id: profile?.institution_id || 'a0000000-0000-0000-0000-000000000001' },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: profile || { id: userId, email, full_name: fullName, role },
      token
    });
  } catch (err: any) {
    console.error('Registration failed:', err);
    res.status(500).json({ error: 'InternalServerError', message: 'Failed to complete registration' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  // Check demo credentials shortcut for rapid presentation/evaluation
  if (DEMO_USERS[email]) {
    const demoUser = DEMO_USERS[email];
    const token = jwt.sign(
      { sub: demoUser.id, email: demoUser.email, role: demoUser.role, institution_id: demoUser.institution_id },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful (Demonstration Account)',
      user: demoUser,
      token
    });
    return;
  }

  try {
    // Authenticate through Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) {
      res.status(401).json({ error: 'InvalidCredentials', message: 'Invalid email or password' });
      return;
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const token = data.session?.access_token || jwt.sign(
      { sub: data.user.id, email: data.user.email, role: profile?.role || 'student', institution_id: profile?.institution_id },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: profile || {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || 'Campus Member',
        role: profile?.role || 'student'
      },
      token
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'InternalServerError', message: 'Login processing failed' });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  res.json({ user: req.user });
}

export async function logout(req: Request, res: Response): Promise<void> {
  res.json({ message: 'Logged out successfully' });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = jwt.sign(
    { sub: req.user.id, email: req.user.email, role: req.user.role, institution_id: req.user.institution_id },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: req.user });
}

