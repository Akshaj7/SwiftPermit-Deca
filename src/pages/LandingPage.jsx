import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoGraphic from '../components/LogoGraphic.jsx'
import { useAuth } from '../context/AuthContext.jsx'
function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const NODES = 60
    const nodes = Array.from({ length: NODES }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2 + 1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 180) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(100,180,200,${0.18 * (1 - dist / 180)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      nodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(100,190,210,0.6)'
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-canvas" />
}


export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleDashboardRedirect = () => {
    if (user?.role === 'official') {
      navigate('/review')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="#" className="navbar-logo" onClick={e => { e.preventDefault(); window.scrollTo(0,0) }} style={{ padding: 0 }}>
            <LogoGraphic size={44} />
          </a>
          <div className="navbar-links">
            <a href="#features">Features</a>
            <a href="#support">Support</a>
          </div>
          <div className="navbar-actions">
            {!user ? (
              <>
                <button className="btn btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Get Started</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={handleDashboardRedirect}>Go to Dashboard</button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <HeroCanvas />
        <div className="hero-content">
          <div className="hero-badge">The Future of Permit Management</div>
          <h1 className="hero-title">Permits Simplified.</h1>
          <p className="hero-subtitle" style={{ maxWidth: '800px' }}>
            One platform to apply, track, and manage all your building permits in real-time. Start your next project with SwiftPermit.
          </p>
          <button className="btn btn-primary btn-lg hero-cta" onClick={() => user ? handleDashboardRedirect() : navigate('/login')}>
            {user ? 'Go to Dashboard →' : 'Get Started →'}
          </button>
        </div>
      </section>
    </>
  )
}
