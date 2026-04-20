import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Bell, Settings, LogOut,
  CheckCircle, XCircle, Clock, AlertCircle, X, Activity, Upload
} from 'lucide-react'
import LogoGraphic from '../components/LogoGraphic.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { usePermits } from '../context/PermitContext.jsx'
import Toast from '../components/Toast.jsx'
import SettingsPage from './SettingsPage.jsx'

const STATUS_MAP = {
  submitted: { label: 'Submitted',    cls: 'badge-submitted', icon: <Clock size={12} /> },
  review:    { label: 'Under Review', cls: 'badge-review',    icon: <AlertCircle size={12} /> },
  approved:  { label: 'Approved',     cls: 'badge-approved',  icon: <CheckCircle size={12} /> },
  rejected:  { label: 'Rejected',     cls: 'badge-rejected',  icon: <XCircle size={12} /> },
}

export default function OfficialReview() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { permits, updatePermitStatus, stats } = usePermits()
  const [selected, setSelected] = useState(null)
  const [comment, setComment] = useState('')
  const [activeNav, setActiveNav] = useState('queue')
  const [toasts, setToasts] = useState([])

  const queue = permits.filter(p => ['submitted', 'review'].includes(p.status))

  const addToast = (msg, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500)
  }

  const [decisionFile, setDecisionFile] = useState(null)

  const handleApprove = () => {
    if (!selected) return
    updatePermitStatus(selected.id, 'approved', {
      note: comment || 'All documents verified. Application approved.',
      decisionFile: decisionFile ? decisionFile.name : null
    })
    addToast(`Permit ${selected.id} approved ✓`, 'success')
    setSelected(null)
    setComment('')
    setDecisionFile(null)
  }

  const handleReject = () => {
    if (!selected || !comment.trim()) {
      addToast('Please provide a reason for rejection.', 'error')
      return
    }
    updatePermitStatus(selected.id, 'rejected', { note: comment })
    addToast(`Permit ${selected.id} rejected`, 'error')
    setSelected(null)
    setComment('')
  }

  const handleMarkReview = (permit) => {
    updatePermitStatus(permit.id, 'review', 'Currently under departmental review.')
    addToast(`${permit.id} marked as Under Review`, 'info')
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ padding: '1.5rem 1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <LogoGraphic size={44} style={{ color: 'var(--white)' }} />
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Review Portal</div>
          {[
            { id: 'queue',   label: 'Applications Queue', icon: <FileText size={18} /> },
            { id: 'stats',   label: 'Statistics',         icon: <LayoutDashboard size={18} /> },
          ].map(item => (
            <button key={item.id} className={`sidebar-item ${activeNav === item.id ? 'active' : ''}`} onClick={() => setActiveNav(item.id)}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-section-label" style={{ padding: '0 0.875rem 0.5rem', opacity: 0.5 }}>Account</div>
          <button className={`sidebar-item ${activeNav === 'notifs' ? 'active' : ''}`} onClick={() => setActiveNav('notifs')}>
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
            <div className="page-title">{activeNav === 'settings' ? 'Settings' : 'Reviewer Portal'}</div>
            <div className="page-subtitle">
              {activeNav === 'settings' 
                ? 'Manage your review configurations and API access.' 
                : 'Government of Chesterfield — Building Permits Division'}
            </div>
          </div>
          
          <div className="topbar-user">
            <div className="topbar-user-info">
              <div className="topbar-user-name">{user?.name}</div>
              <div className="topbar-user-role">Gov. Official</div>
            </div>
            <div className="topbar-avatar">{user?.initials}</div>
          </div>
        </div>

        {activeNav === 'settings' ? (
          <SettingsPage />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="review-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {[
                { label: 'Pending Queue', value: queue.length, color: '#f59e0b' },
                { label: 'Approved Today', value: stats.approved, color: '#10b981' },
                { label: 'Total Volume', value: permits.length, color: '#3b82f6' },
              ].map((s, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-label">
                    <span className="stat-dot" style={{ background: s.color }} />
                    {s.label}
                  </div>
                  <div className="stat-value">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Applications Queue */}
            <div className="section-card">
              <div className="section-card-header">
                <span className="section-card-title">
                  <Activity size={16} style={{ display: 'inline', marginRight: 6 }} />
                  Pending Applications
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{queue.length} awaiting review</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Permit ID</th>
                    <th>Project</th>
                    <th>Type</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {permits.map(p => {
                    const s = STATUS_MAP[p.status] || STATUS_MAP.submitted
                    return (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.projectName}</td>
                        <td style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{p.type}</td>
                        <td style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{p.submitted}</td>
                        <td><span className={`badge ${s.cls}`}>{s.icon}&nbsp;{s.label}</span></td>
                        <td style={{ display: 'flex', gap: 6 }}>
                          {['submitted', 'review'].includes(p.status) ? (
                            <>
                              <button className="action-btn" onClick={() => { setSelected(p); setComment('') }}>Review</button>
                              {p.status === 'submitted' && (
                                <button className="action-btn" onClick={() => handleMarkReview(p)} style={{ borderColor: '#6d28d9', color: '#6d28d9' }}>
                                  In Review
                                </button>
                              )}
                            </>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Processed</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* Review Drawer */}
      {selected && (
        <>
          <div className="drawer-overlay" onClick={() => setSelected(null)} />
          <div className="drawer">
            <div className="drawer-header">
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Permit {selected.id}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: 2 }}>Full Application Review</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              {[
                ['Project Name', selected.projectName],
                ['Address', selected.address],
                ['Permit Type', selected.type],
                ['Date Submitted', selected.submitted],
                ['Last Updated', selected.updated],
                ['Description', selected.description],
              ].map(([label, value]) => (
                <div className="detail-group" key={label}>
                  <div className="detail-label">{label}</div>
                  <div className="detail-value">{value}</div>
                </div>
              ))}

              <div className="detail-group">
                <div className="detail-label">Current Status</div>
                <span className={`badge ${STATUS_MAP[selected.status]?.cls}`}>
                  {STATUS_MAP[selected.status]?.icon}&nbsp;
                  {STATUS_MAP[selected.status]?.label}
                </span>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                  Upload Decision Document
                </label>
                <div 
                  onClick={() => document.getElementById('review-upload').click()}
                  style={{ 
                    border: '2px dashed var(--gray-200)', 
                    borderRadius: 12, 
                    padding: '1.5rem', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    background: decisionFile ? 'var(--emerald-faint)' : 'transparent',
                    borderColor: decisionFile ? 'var(--emerald)' : 'var(--gray-200)',
                    transition: 'var(--transition)'
                  }}
                >
                  <Upload size={24} className={decisionFile ? 'text-emerald' : 'text-gray-400'} style={{ marginBottom: 8, margin: '0 auto' }} />
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500, color: decisionFile ? 'var(--emerald)' : 'inherit' }}>
                    {decisionFile ? decisionFile.name : 'Click to attach approved plans or letter'}
                  </p>
                  <input type="file" id="review-upload" hidden onChange={(e) => setDecisionFile(e.target.files[0])} />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Reviewer Comment
                </label>
                <textarea
                  className="comment-area"
                  placeholder="Add notes, conditions of approval, or a rejection reason (required for rejection)…"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </div>
            </div>

            <div className="drawer-footer">
              <button className="btn btn-danger" onClick={handleReject}>
                <XCircle size={16} /> Reject
              </button>
              <button className="btn btn-primary" onClick={handleApprove}>
                <CheckCircle size={16} /> Approve
              </button>
            </div>
          </div>
        </>
      )}

      <Toast toasts={toasts} />
    </div>
  )
}
