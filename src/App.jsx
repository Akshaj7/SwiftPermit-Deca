import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import FeaturesPage from './pages/FeaturesPage.jsx'
import DeveloperDashboard from './pages/DeveloperDashboard.jsx'
import SubmitPermit from './pages/SubmitPermit.jsx'
import OfficialReview from './pages/OfficialReview.jsx'
import ComplianceChecker from './pages/ComplianceChecker.jsx'

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DeveloperDashboard />
        </ProtectedRoute>
      } />
      <Route path="/submit" element={
        <ProtectedRoute requiredRole="developer">
          <SubmitPermit />
        </ProtectedRoute>
      } />
      <Route path="/compliance" element={
        <ProtectedRoute requiredRole="developer">
          <ComplianceChecker />
        </ProtectedRoute>
      } />
      <Route path="/review" element={
        <ProtectedRoute requiredRole="official">
          <OfficialReview />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
