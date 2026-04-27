import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CoursePage from './pages/CoursePage';
import ProgressPage from './pages/ProgressPage';
import CodingPractice from './pages/CodingPractice';
import CodingProblem from './pages/CodingProblem';
import CertificatesPage from './pages/CertificatesPage';
import CertificateVerify from './pages/CertificateVerify';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminProblems from './pages/admin/AdminProblems';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:certId" element={<CertificateVerify />} />

          {/* Protected User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/course/:id" element={
            <ProtectedRoute><CoursePage /></ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute><ProgressPage /></ProtectedRoute>
          } />
          <Route path="/coding" element={
            <ProtectedRoute><CodingPractice /></ProtectedRoute>
          } />
          <Route path="/coding/:id" element={
            <ProtectedRoute><CodingProblem /></ProtectedRoute>
          } />
          <Route path="/certificates" element={
            <ProtectedRoute><CertificatesPage /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
          <Route path="/admin/courses" element={
            <AdminRoute><AdminCourses /></AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute><AdminUsers /></AdminRoute>
          } />
          <Route path="/admin/payments" element={
            <AdminRoute><AdminPayments /></AdminRoute>
          } />
          <Route path="/admin/coupons" element={
            <AdminRoute><AdminCoupons /></AdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute><AdminAnalytics /></AdminRoute>
          } />
          <Route path="/admin/problems" element={
            <AdminRoute><AdminProblems /></AdminRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
              <h1 className="text-6xl font-black gradient-text mb-4">404</h1>
              <p className="text-slate-400 text-lg mb-6">Page not found</p>
              <a href="/" className="gradient-btn no-underline">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
