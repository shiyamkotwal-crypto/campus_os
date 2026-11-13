import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import {
  PrivacyPage,
  TermsPage,
  UnauthorizedPage,
  ForgotPasswordPage
} from './pages/public/LegalPages';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentAssistant } from './pages/student/StudentAssistant';
import { StudentAnnouncements } from './pages/student/StudentAnnouncements';
import { StudentAcademics } from './pages/student/StudentAcademics';
import { StudentTimetable } from './pages/student/StudentTimetable';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentEvents } from './pages/student/StudentEvents';
import { StudentLostFound } from './pages/student/StudentLostFound';
import { StudentNavigation } from './pages/student/StudentNavigation';
import { StudentSupport } from './pages/student/StudentSupport';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { StudentDocuments } from './pages/student/StudentDocuments';
import { StudentProfile } from './pages/student/StudentProfile';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyAnnouncements } from './pages/faculty/FacultyAnnouncements';
import { FacultyCourses } from './pages/faculty/FacultyCourses';
import { FacultyAssignments } from './pages/faculty/FacultyAssignments';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminDocuments } from './pages/admin/AdminDocuments';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<AppLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/assistant" element={<StudentAssistant />} />
          <Route path="/student/announcements" element={<StudentAnnouncements />} />
          <Route path="/student/academics" element={<StudentAcademics />} />
          <Route path="/student/timetable" element={<StudentTimetable />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/events" element={<StudentEvents />} />
          <Route path="/student/lost-found" element={<StudentLostFound />} />
          <Route path="/student/navigation" element={<StudentNavigation />} />
          <Route path="/student/support" element={<StudentSupport />} />
          <Route path="/student/notifications" element={<StudentNotifications />} />
          <Route path="/student/documents" element={<StudentDocuments />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/settings" element={<StudentProfile />} />
        </Route>
      </Route>

      {/* Faculty Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
        <Route element={<AppLayout />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/announcements" element={<FacultyAnnouncements />} />
          <Route path="/faculty/courses" element={<FacultyCourses />} />
          <Route path="/faculty/assignments" element={<FacultyAssignments />} />
          <Route path="/faculty/students" element={<FacultyCourses />} />
          <Route path="/faculty/timetable" element={<StudentTimetable />} />
          <Route path="/faculty/support" element={<StudentSupport />} />
          <Route path="/faculty/profile" element={<StudentProfile />} />
        </Route>
      </Route>

      {/* Administrator Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/departments" element={<AdminUsers />} />
          <Route path="/admin/programs" element={<AdminUsers />} />
          <Route path="/admin/announcements" element={<FacultyAnnouncements />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
          <Route path="/admin/courses" element={<FacultyCourses />} />
          <Route path="/admin/assignments" element={<FacultyAssignments />} />
          <Route path="/admin/timetable" element={<StudentTimetable />} />
          <Route path="/admin/attendance" element={<StudentAttendance />} />
          <Route path="/admin/events" element={<StudentEvents />} />
          <Route path="/admin/services" element={<StudentNavigation />} />
          <Route path="/admin/support" element={<StudentSupport />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default App;

