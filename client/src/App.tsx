import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Dedicated Layouts for 3 Portals
import { StudentLayout } from './components/layout/StudentLayout';
import { FacultyLayout } from './components/layout/FacultyLayout';
import { AdminLayout } from './components/layout/AdminLayout';

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

// Student Portal Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentAcademics } from './pages/student/StudentAcademics';
import { StudentResults } from './pages/student/StudentResults';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentTimetable } from './pages/student/StudentTimetable';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentMaterials } from './pages/student/StudentMaterials';
import { StudentFaculty } from './pages/student/StudentFaculty';
import { StudentLeave } from './pages/student/StudentLeave';
import { StudentFees } from './pages/student/StudentFees';
import { StudentCalendar } from './pages/student/StudentCalendar';
import { StudentAnnouncements } from './pages/student/StudentAnnouncements';
import { StudentAssistant } from './pages/student/StudentAssistant';
import { StudentEvents } from './pages/student/StudentEvents';
import { StudentLostFound } from './pages/student/StudentLostFound';
import { StudentNavigation } from './pages/student/StudentNavigation';
import { StudentSupport } from './pages/student/StudentSupport';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { StudentDocuments } from './pages/student/StudentDocuments';
import { StudentProfile } from './pages/student/StudentProfile';

// Faculty Portal Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyClasses } from './pages/faculty/FacultyClasses';
import { FacultyCourses } from './pages/faculty/FacultyCourses';
import { FacultyAttendance } from './pages/faculty/FacultyAttendance';
import { FacultyAssignments } from './pages/faculty/FacultyAssignments';
import { FacultySubmissions } from './pages/faculty/FacultySubmissions';
import { FacultyMarks } from './pages/faculty/FacultyMarks';
import { FacultyTimetable } from './pages/faculty/FacultyTimetable';
import { FacultyMaterials } from './pages/faculty/FacultyMaterials';
import { FacultyPerformance } from './pages/faculty/FacultyPerformance';
import { FacultyCalendar } from './pages/faculty/FacultyCalendar';
import { FacultyAnnouncements } from './pages/faculty/FacultyAnnouncements';
import { FacultySupport } from './pages/faculty/FacultySupport';
import { FacultyProfile } from './pages/faculty/FacultyProfile';

// Administrator Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminDepartments } from './pages/admin/AdminDepartments';
import { AdminPrograms } from './pages/admin/AdminPrograms';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminTimetable } from './pages/admin/AdminTimetable';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminExaminations } from './pages/admin/AdminExaminations';
import { AdminCalendar } from './pages/admin/AdminCalendar';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminDocuments } from './pages/admin/AdminDocuments';
import { AdminSupport } from './pages/admin/AdminSupport';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminSettings } from './pages/admin/AdminSettings';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes & Dedicated Login Entry Points */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/student/login" element={<LoginPage enforcedRole="student" />} />
      <Route path="/faculty/login" element={<LoginPage enforcedRole="faculty" />} />
      <Route path="/admin/login" element={<LoginPage enforcedRole="admin" />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* STUDENT PORTAL — Dedicated Route Guard & Layout */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/academics" element={<StudentAcademics />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/timetable" element={<StudentTimetable />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/materials" element={<StudentMaterials />} />
          <Route path="/student/faculty" element={<StudentFaculty />} />
          <Route path="/student/announcements" element={<StudentAnnouncements />} />
          <Route path="/student/leave" element={<StudentLeave />} />
          <Route path="/student/fees" element={<StudentFees />} />
          <Route path="/student/calendar" element={<StudentCalendar />} />
          <Route path="/student/assistant" element={<StudentAssistant />} />
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

      {/* FACULTY PORTAL — Dedicated Route Guard & Layout */}
      <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
        <Route element={<FacultyLayout />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/courses" element={<FacultyCourses />} />
          <Route path="/faculty/classes" element={<FacultyClasses />} />
          <Route path="/faculty/attendance" element={<FacultyAttendance />} />
          <Route path="/faculty/timetable" element={<FacultyTimetable />} />
          <Route path="/faculty/assignments" element={<FacultyAssignments />} />
          <Route path="/faculty/submissions" element={<FacultySubmissions />} />
          <Route path="/faculty/marks" element={<FacultyMarks />} />
          <Route path="/faculty/materials" element={<FacultyMaterials />} />
          <Route path="/faculty/announcements" element={<FacultyAnnouncements />} />
          <Route path="/faculty/performance" element={<FacultyPerformance />} />
          <Route path="/faculty/calendar" element={<FacultyCalendar />} />
          <Route path="/faculty/notifications" element={<StudentNotifications />} />
          <Route path="/faculty/support" element={<FacultySupport />} />
          <Route path="/faculty/profile" element={<FacultyProfile />} />
          <Route path="/faculty/settings" element={<FacultyProfile />} />
        </Route>
      </Route>

      {/* ADMINISTRATOR PORTAL — Dedicated Route Guard & Layout */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/timetable" element={<AdminTimetable />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/examinations" element={<AdminExaminations />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/profile" element={<AdminUsers />} />
        </Route>
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
