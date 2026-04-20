import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, CheckCircle, ArrowLeft, ArrowRight, LayoutDashboard, FileText, PlusCircle, CheckSquare, Bell, Settings, LogOut, XCircle } from 'lucide-react'
import LogoGraphic from '../components/LogoGraphic.jsx'
import { usePermits } from '../context/PermitContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const STEPS = ['Project Info', 'Documents', 'Review & Submit']

const PERMIT_TYPES = ['Residential', 'Commercial', 'Industrial', 'Mixed-Use', 'Renovation', 'Other']

export default function SubmitPermit() {
  const navigate = useNavigate()
  const { addPermit } = usePermits()
  const { user, logout } = useAuth()
  const [step, setStep] = useState(0)
  const [activeNav, setActiveNav] = useState('submit')
  const [form, setForm] = useState({ 
    projectName: '', 
    address: '', 
    type: 'Residential', 
    description: '',
    documents: [] 
  })
  const [submitted, setSubmitted] = useState(false)
  const [permId, setPermId] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setForm(prev => ({
        ...prev,
        documents: [...prev.documents, ...files.map(f => f.name)]
      }))
    }
  }

  const handleSubmit = () => {
    const id = addPermit(form)
    setPermId(id)
    setSubmitted(true)
  }

  const Sidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ padding: '1.5rem 1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <LogoGraphic size={44} style={{ color: 'var(--white)' }} />
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, action: () => navigate('/dashboard') },
          { id: 'checker',   label: 'Permit Checker', icon: <CheckSquare size={18} />, action: () => navigate('/compliance') },
          { id: 'submit',    label: 'Submit Permit',  icon: <PlusCircle size={18} />, action: () => {} },
        ].map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${item.id === 'submit' ? 'active' : ''}`}
            onClick={() => item.action?.()}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-section-label" style={{ padding: '0 0.875rem 0.5rem', opacity: 0.5 }}>Account</div>
        <button className={`sidebar-item ${activeNav === 'notifs' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
          <Bell size={18} /> Notifications
        </button>
        <button className={`sidebar-item ${activeNav === 'settings' ? 'active' : ''}`} onClick={() => navigate('/dashboard')} style={{ width: '100%', marginBottom: 4 }}>
          <Settings size={18} /> Settings
        </button>
        <button className="sidebar-item" onClick={handleLogout} style={{ width: '100%' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  )

  if (submitted) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-topbar">
            <div>
              <div className="page-title">Permit Submitted</div>
              <div className="page-subtitle">Your application is now under review.</div>
            </div>
            
            <div className="topbar-user">
              <div className="topbar-user-info">
                <div className="topbar-user-name">{user?.name}</div>
                <div className="topbar-user-role">Developer</div>
              </div>
              <div className="topbar-avatar">{user?.initials}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center', maxWidth: 480 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--emerald-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--emerald)' }}>
                <CheckCircle size={36} />
              </div>
              <h2 style={{ marginBottom: '0.5rem' }}>Application Submitted!</h2>
              <p style={{ color: 'var(--gray-500)', marginBottom: '0.375rem' }}>Your permit application <strong>{permId}</strong> has been received.</p>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '2rem' }}>A city reviewer will assess your application typically within 3–5 business days. You'll be notified of any status changes.</p>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <div className="page-title">Submit Permit Application</div>
            <div className="page-subtitle">Complete all steps to submit your building permit request.</div>
          </div>
          
          <div className="topbar-user">
            <div className="topbar-user-info">
              <div className="topbar-user-name">{user?.name}</div>
              <div className="topbar-user-role">Developer</div>
            </div>
            <div className="topbar-avatar">{user?.initials}</div>
          </div>
        </div>

        <div className="submit-layout">
          {/* Progress Steps */}
          <div className="progress-steps">
            {STEPS.map((s, i) => (
              <>
                <div className="progress-step" key={s}>
                  <div className={`step-circle ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                    {i < step ? <CheckCircle size={16} /> : i + 1}
                  </div>
                  <span className={`step-label ${i === step ? 'active' : ''}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} key={`line-${i}`} />}
              </>
            ))}
          </div>

          {/* Step 0 — Project Info */}
          {step === 0 && (
            <div className="form-card">
              <h3>Project Information</h3>
              <p className="form-desc">Provide the basic details about your construction project.</p>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Project Name *</label>
                  <input type="text" placeholder="e.g. Oak Street Mixed-Use Development" value={form.projectName} onChange={e => update('projectName', e.target.value)} required />
                </div>
                <div className="form-group full">
                  <label>Project Address *</label>
                  <input type="text" placeholder="e.g. 142 Oak Street, Chesterfield, MO" value={form.address} onChange={e => update('address', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Permit Type *</label>
                  <select value={form.type} onChange={e => update('type', e.target.value)}>
                    {PERMIT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group full">
                  <label>Project Description *</label>
                  <textarea placeholder="Brief description of all planned construction or renovation work..." value={form.description} onChange={e => update('description', e.target.value)} rows={4} style={{ resize: 'vertical' }} required />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" onClick={() => setStep(1)} disabled={!form.projectName || !form.address || !form.description}>
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 1 — Documents */}
          {step === 1 && (
            <div className="form-card">
              <h3>Required Documents</h3>
              <p className="form-desc">Upload your construction plans and supporting documents.</p>
              
              <div 
                className="upload-zone" 
                onClick={() => document.getElementById('file-upload').click()}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  multiple 
                  hidden 
                  onChange={handleFileUpload} 
                />
                <div className="upload-icon"><Upload size={36} /></div>
                <p>Click or drag & drop your documents here</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: 4 }}>PDF, PNG, JPEG up to 50MB</p>
              </div>

              {form.documents.length > 0 && (
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {form.documents.map((name, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--gray-100)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={16} className="text-emerald" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{name}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== idx) }));
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--gray-700)' }}>Pre-Submission Checklist</div>
                <div className="checklist">
                  {['Site plan with property boundaries', 'Floor plan drawings (all levels)', 'Elevation drawings', 'Structural engineering reports', 'Zoning compliance statement'].map(item => (
                    <div className="checklist-item" key={item}>
                      <CheckCircle size={16} className="checklist-check" color="var(--emerald)" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setStep(0)}><ArrowLeft size={16} /> Back</button>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Review Application <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {/* Step 2 — Review */}
          {step === 2 && (
            <div className="form-card">
              <h3>Review & Submit</h3>
              <p className="form-desc">Please confirm all details are correct before submitting.</p>
              <div className="review-summary">
                <div className="review-row">
                  <span className="review-label">Project Name</span>
                  <span className="review-value">{form.projectName}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">Address</span>
                  <span className="review-value">{form.address}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">Permit Type</span>
                  <span className="review-value">{form.type}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">Description</span>
                  <span className="review-value" style={{ maxWidth: 300, textAlign: 'right' }}>{form.description}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">Applicant</span>
                  <span className="review-value">{user?.name} — {user?.company}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">Documents</span>
                  <span className="review-value" style={{ color: 'var(--emerald)' }}>{form.documents.length} files uploaded</span>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  <CheckCircle size={16} /> Submit Application
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
