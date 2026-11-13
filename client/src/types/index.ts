export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  institution_id: string;
  institutional_id?: string;
  department_id?: string | null;
  department_name?: string | null;
  program_id?: string | null;
  program_name?: string | null;
  academic_year?: number | null;
  semester?: number | null;
  avatar_url?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'examination' | 'department' | 'emergency' | 'event' | 'general' | string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  published: boolean;
  published_at?: string;
  author_name?: string;
  is_read?: boolean;
  target_role?: string;
  is_pinned?: boolean;
  created_at?: string;
}

export interface Course {
  id: string;
  course_code?: string;
  code?: string;
  course_name?: string;
  title?: string;
  academic_year?: number;
  semester?: number | string;
  description?: string;
  faculty_name?: string;
  instructor_name?: string;
  credits?: number;
  enrolled_count?: number;
  max_capacity?: number;
}

export interface TimetableEntry {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  courses: {
    id: string;
    course_code: string;
    course_name: string;
  };
  profiles?: {
    full_name: string;
  };
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  due_at: string;
  attachment_url?: string;
  max_marks: number;
  courses?: {
    course_code: string;
    course_name: string;
  };
  my_submission?: {
    id: string;
    status: string;
    marks?: number;
    submitted_at: string;
  };
}

export interface AttendanceRecord {
  id: string;
  attendance_date: string;
  status: 'present' | 'absent' | 'excused';
  courses: {
    course_code: string;
    course_name: string;
  };
}

export interface AttendanceSummary {
  course_code: string;
  course_name: string;
  total_sessions: number;
  attended_sessions: number;
  percentage: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  start_at: string;
  end_at: string;
  capacity: number;
  current_registrations?: number;
  is_registered?: boolean;
  image_url?: string;
  organizer_name?: string;
}

export interface LostFoundItem {
  id: string;
  item_name: string;
  description: string;
  report_type: 'lost' | 'found';
  category: string;
  location_description: string;
  image_url?: string;
  status: 'open' | 'claimed' | 'resolved' | 'closed';
  created_at: string;
  reporter_display: string;
  is_mine: boolean;
}

export interface CampusLocation {
  id: string;
  name: string;
  category: string;
  description?: string;
  building: string;
  floor: string;
  latitude?: number;
  longitude?: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  student?: {
    full_name: string;
    email: string;
  };
}

export interface AICitation {
  document_id: string;
  document_title: string;
  page_number?: number | null;
  supporting_excerpt: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: AICitation[];
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  read_at?: string | null;
  created_at: string;
}

export interface AcademicResult {
  id: string;
  course_code: string;
  course_name: string;
  credits: number;
  internal_marks: number;
  max_internal: number;
  exam_marks?: number;
  max_exam?: number;
  total_marks: number;
  grade_letter: string;
  grade_point: number;
  exam_type: 'midterm' | 'end_semester' | 'quiz' | 'assignment';
  semester: number;
  status: 'passed' | 'reappear' | 'pending';
}

export interface LeaveApplication {
  id: string;
  student_id: string;
  student_name: string;
  leave_type: 'medical' | 'personal' | 'academic' | 'duty';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  remarks?: string;
}

export interface StudyMaterial {
  id: string;
  course_id: string;
  course_code: string;
  course_name: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: string;
  uploaded_by_name: string;
  uploaded_at: string;
}

export interface CalendarMilestone {
  id: string;
  title: string;
  description?: string;
  event_type?: 'exam' | 'holiday' | 'academic' | 'registration' | 'cultural' | string;
  start_date?: string;
  event_date?: string;
  end_date?: string;
  applies_to?: string;
  category?: 'exam' | 'holiday' | 'academic' | 'registration' | 'cultural' | 'examination' | 'event' | string;
  is_holiday?: boolean;
  semester?: string;
}

export interface FacultyMember {
  id: string;
  full_name?: string;
  name?: string;
  email: string;
  designation: string;
  department_name?: string;
  department?: string;
  specialization?: string;
  office_location?: string;
  office_hours?: string;
  avatar_url?: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  faculty_count?: number;
  total_faculty?: number;
  student_count?: number;
  total_students?: number;
  courses_count?: number;
  head_of_department?: string;
  building_location?: string;
}

export interface ProgramItem {
  id: string;
  name: string;
  code?: string;
  degree_type: string;
  duration_years: number;
  total_credits?: number;
  department_id?: string;
  department_name?: string;
  student_count?: number;
}

export interface FeeRecord {
  id: string;
  semester: number;
  academic_year: number;
  tuition_fee: number;
  lab_fee: number;
  library_fee: number;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  due_date: string;
  status: 'paid' | 'partial' | 'pending';
  receipt_url?: string;
}

