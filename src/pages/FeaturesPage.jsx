import { useNavigate } from 'react-router-dom'
import { Zap, Bell, LayoutDashboard } from 'lucide-react'
import LogoGraphic from '../components/LogoGraphic.jsx'

const FEATURES = [
  {
    icon: <Zap size={22} />,
    category: 'SMART APPLICATION ENGINE',
    title: 'Stop guessing, start building.',
    desc: 'Our intuitive interface guides users through complex local building codes in real-time. It automatically flags missing documents and errors before you hit submit, reducing rejection rates by up to 60%.',
  },
  {
    icon: <Bell size={22} />,
    category: 'REAL-TIME STATUS TRACKING',
    title: 'Transparency at every stage.',
    desc: 'No more "black hole" waiting periods. Applicants receive instant SMS and email notifications as their permit moves from "Initial Review" to "Departmental Approval" and "Final Issuance."',
  },
  {
    icon: <LayoutDashboard size={22} />,
    category: 'UNIFIED AGENCY DASHBOARD',
    title: 'One platform, all departments.',
    desc: 'SwiftPermit syncs Fire, Zoning, and Public Works into a single digital workspace. This eliminates communication silos and allows for parallel reviews, cutting the total approval timeline in half.',
  },
]

export default function FeaturesPage() {
  const navigate = useNavigate()

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="#" className="navbar-logo" onClick={e => { e.preventDefault(); navigate('/') }} style={{ padding: 0 }}>
            <LogoGraphic size={44} variant="dark" />
          </a>
          <div className="navbar-links">
            <a href="#/features">Features</a>
            <a href="#/support">Support</a>
          </div>
          <div className="navbar-actions">
            <button className="btn btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Features */}
      <section className="features" id="features">
        <div className="features-inner">
          <div className="section-header">
            <h2>Everything you need to move faster</h2>
            <p>From application to approval, SwiftPermit streamlines every step.</p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-category">{f.category}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <LogoGraphic size={32} variant="white" style={{ color: 'var(--white)' }} />
          </div>
          <span className="footer-copy">© 2026 SwiftPermit. All rights reserved.</span>
        </div>
      </footer>
    </>
  )
}
