import { z } from 'zod';

// ==============================================================================
// 1. AI STRUCTURED SCHEMAS (Prompt Section 15)
// ==============================================================================

// 15.1 Notice Extraction Schema
export const NoticeExtractionSchema = z.object({
  title: z.string(),
  category: z.enum(['exam', 'assignment', 'event', 'announcement', 'administrative', 'other']),
  summary: z.string(),
  important_dates: z.array(
    z.object({
      date: z.string().nullable(),
      description: z.string(),
      date_type: z.enum(['exam', 'deadline', 'event', 'other']),
      source_text: z.string()
    })
  ),
  required_actions: z.array(
    z.object({
      action: z.string(),
      deadline: z.string().nullable(),
      source_text: z.string()
    })
  ),
  target_audience: z.array(z.string()),
  uncertainties: z.array(z.string())
});

export type NoticeExtraction = z.infer<typeof NoticeExtractionSchema>;

// 15.2 AI Campus Answer Schema
export const CampusAnswerSchema = z.object({
  answer: z.string(),
  confidence: z.enum(['high', 'medium', 'low']),
  answer_type: z.enum(['verified', 'general_guidance', 'insufficient_information']),
  sources: z.array(
    z.object({
      document_id: z.string(),
      document_title: z.string(),
      page_number: z.number().nullable().optional(),
      supporting_excerpt: z.string()
    })
  ),
  follow_up_question: z.string().nullable().optional()
});

export type CampusAnswer = z.infer<typeof CampusAnswerSchema>;

// 15.3 AI Study Planner Schema
export const StudyPlanSchema = z.object({
  plan_title: z.string(),
  summary: z.string(),
  days: z.array(
    z.object({
      date: z.string(),
      tasks: z.array(
        z.object({
          subject: z.string(),
          topic: z.string(),
          duration_minutes: z.number().min(10).max(480),
          priority: z.enum(['high', 'medium', 'low']),
          reason: z.string()
        })
      )
    })
  ),
  recommendations: z.array(z.string()),
  assumptions: z.array(z.string())
});

export type StudyPlan = z.infer<typeof StudyPlanSchema>;

// 15.4 Document Summarization Schema
export const DocumentSummarizationSchema = z.object({
  title: z.string(),
  summary: z.string(),
  key_points: z.array(z.string()),
  important_dates: z.array(z.string()),
  required_actions: z.array(z.string()),
  uncertainties: z.array(z.string())
});

export type DocumentSummarization = z.infer<typeof DocumentSummarizationSchema>;

// 15.5 Query Classification Schema
export const QueryClassificationSchema = z.object({
  intent: z.enum([
    'academic',
    'announcements',
    'timetable',
    'attendance',
    'events',
    'campus_navigation',
    'support',
    'general'
  ]),
  requires_retrieval: z.boolean(),
  priority: z.enum(['normal', 'high']),
  clarification_required: z.boolean(),
  clarification_question: z.string().nullable().optional()
});

export type QueryClassification = z.infer<typeof QueryClassificationSchema>;

// ==============================================================================
// 2. API REQUEST & DATA VALIDATION SCHEMAS (Prompt Section 16)
// ==============================================================================

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2),
  role: z.enum(['student', 'faculty', 'admin']).default('student'),
  institutionId: z.string().uuid().optional(),
  institutionalId: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  programId: z.string().uuid().optional(),
  academicYear: z.coerce.number().min(1).max(5).optional(),
  semester: z.coerce.number().min(1).max(10).optional()
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const ProfileUpdateSchema = z.object({
  full_name: z.string().min(2).optional(),
  avatar_url: z.string().url().optional(),
  academic_year: z.number().min(1).max(5).optional(),
  semester: z.number().min(1).max(10).optional()
});

export const AnnouncementSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(10),
  category: z.enum(['academic', 'examination', 'department', 'emergency', 'event', 'general']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  target_departments: z.array(z.string().uuid()).optional(),
  target_academic_years: z.array(z.number()).optional(),
  target_semesters: z.array(z.number()).optional(),
  published: z.boolean().default(true),
  expires_at: z.string().datetime().optional()
});

export const AssignmentSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  due_at: z.string().datetime(),
  attachment_url: z.string().url().optional(),
  max_marks: z.number().positive().default(100)
});

export const SubmissionSchema = z.object({
  assignment_id: z.string().uuid(),
  submission_url: z.string().url(),
  feedback: z.string().optional()
});

export const EventSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10),
  category: z.enum(['workshop', 'hackathon', 'cultural', 'sports', 'seminar', 'general']),
  location: z.string().min(2),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  capacity: z.number().int().positive().default(100),
  registration_enabled: z.boolean().default(true),
  image_url: z.string().url().optional()
});

export const SupportTicketSchema = z.object({
  subject: z.string().min(5).max(255),
  description: z.string().min(10),
  category: z.enum(['academic', 'technical', 'administrative', 'facilities', 'general']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal')
});

export const DocumentUploadSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  category: z.enum(['policy', 'syllabus', 'handbook', 'notice', 'form', 'general']),
  access_scope: z.enum(['institution', 'department', 'public']).default('institution'),
  department_id: z.string().uuid().optional()
});

