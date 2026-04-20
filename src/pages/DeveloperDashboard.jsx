import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, PlusCircle, Bell, Settings,
  LogOut, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, Activity, CheckSquare
} from 'lucide-react'
import LogoGraphic from '../components/LogoGraphic.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { usePermits } from '../context/PermitContext.jsx'
import Toast from '../components/Toast.jsx'
import Drawer from '../components/Drawer.jsx'
import SettingsPage from './SettingsPage.jsx'

const STATUS_MAP = {
  submitted: { label: 'Submitted',    cls: 'badge-submitted', dot: 'blue',   icon: <Clock size={12} /> },
  review:    { label: 'Under Review', cls: 'badge-review',    dot: 'yellow', icon: <AlertCircle size={12} /> },
  approved:  { label: 'Approved',     cls: 'badge-approved',  dot: 'green',  icon: <CheckCircle size={12} /> },
  rejected:  { label: 'Rejected',     cls: 'badge-rejected',  dot: 'red',    icon: <XCircle size={12} /> },
}

export default function DeveloperDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { permits, activity, stats } = usePermits()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [toasts, setToasts] = useState([])

  const myPermits = permits.filter(p => p.applicant === 'dev-001' || p.applicant === user?.id)

  const addToast = (msg, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const STAT_CARDS = [
    { label: 'Active Permits', value: stats.active, color: '#3b82f6', dot: '#3b82f6' },
    { label: 'Pending Review', value: stats.pending, color: '#f59e0b', dot: '#f59e0b' },
    { label: 'Approved', value: stats.approved, color: '#10b981', dot: '#10b981' },
    { label: 'Rejected', value: stats.rejected, color: '#ef4444', dot: '#ef4444' },
  ]

  const DOT_COLORS = { blue: '#3b82f6', green: '#10b981', red: '#ef4444', yellow: '#f59e0b' }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ padding: '1.5rem 1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <LogoGraphic size={44} style={{ color: 'var(--white)' }} />
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main</div>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'checker',   label: 'Permit Checker', icon: <CheckSquare size={18} />, action: () => navigate('/compliance') },
            { id: 'submit',    label: 'Submit Permit',  icon: <PlusCircle size={18} />, action: () => navigate('/submit') },
          ].map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => { setActiveNav(item.id); item.action?.() }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-section-label" style={{ padding: '0 0.875rem 0.5rem', opacity: 0.5 }}>Account</div>
          <button className={`sidebar-item ${activeNav === 'notifications' ? 'active' : ''}`} onClick={() => setActiveNav('notifications')}>
            <Bell size={18} /> Notifications
          </button>
          <button className={`sidebar-item ${activeNav === 'settings' ? 'active' : ''}`} onClick={() => setActiveNav('settings')} style={{ width: '100%', marginBottom: 4 }}>
            <Settings size={18} /> Settings
          </button>
          <button className="sidebar-item" onClick={handleLogout} style={{ width: '100%' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <div className="page-title">{activeNav === 'settings' ? 'Settings' : 'Developer Dashboard'}</div>
            <div className="page-subtitle">
              {activeNav === 'settings' 
                ? 'Configure your API keys and cloud shared storage.' 
                : `Welcome back, ${user?.name.split(' ')[0]}. Here's what's happening today.`}
            </div>
          </div>
          
          <div className="topbar-user">
            <div className="topbar-user-info">
              <div className="topbar-user-name">{user?.name}</div>
              <div className="topbar-user-role">Developer</div>
            </div>
            <div className="topbar-avatar">{user?.initials}</div>
          </div>
        </div>

        {activeNav === 'settings' ? (
          <SettingsPage />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              {STAT_CARDS.map((s, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-label">
                    <span className="stat-dot" style={{ background: s.dot }} />
                    {s.label}
                  </div>
                  <div className="stat-value">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Main Content: Activity Feed (Full Width) */}
            <div className="section-card">
              <div className="section-card-header">
                <span className="section-card-title">
                  <Activity size={16} style={{ display: 'inline', marginRight: 6 }} />
                  Recent System Activity
                </span>
              </div>
              <div className="activity-feed" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {activity.slice(0, 12).map(a => (
                  <div className="activity-item" key={a.id} style={{ borderBottom: '1px solid var(--gray-50)', paddingBottom: '1rem' }}>
                    <div className={`activity-dot ${a.type === 'green' ? '' : a.type}`} style={{ background: DOT_COLORS[a.type] }} />
                    <div style={{ flex: 1 }}>
                      <div className="activity-text" style={{ fontWeight: 500 }}>{a.text}</div>
                      <div className="activity-time" style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <Toast toasts={toasts} />
    </div>
  )
}
