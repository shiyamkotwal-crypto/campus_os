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
  category: 'academic' | 'examination' | 'department' | 'emergency' | 'event' | 'general';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  published: boolean;
  published_at?: string;
  author_name?: string;
  is_read?: boolean;
}

export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  academic_year: number;
  semester: number;
  description?: string;
  faculty_name?: string;
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

