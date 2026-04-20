import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import LogoGraphic from '../components/LogoGraphic.jsx'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 21 21">
    <rect width="10" height="10" fill="#F25022"/>
    <rect x="11" width="10" height="10" fill="#7FBA00"/>
    <rect y="11" width="10" height="10" fill="#00A4EF"/>
    <rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
  </svg>
)



export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginWithCredentials, signup, user } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [role, setRole] = useState('developer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      navigate(user.role === 'official' ? '/review' : '/dashboard')
    }
  }, [user, navigate])

  if (user) return null

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 700))
      if (isSignUp) {
        signup(email, password, role, name)
      } else {
        loginWithCredentials(email, password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (e) => {
    e?.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    login(role) // Mocking social as logging in with a default demo account for now
    setLoading(false)
  }



  return (
    <div className="login-page">
      <div className="login-header">
        <div className="login-logo" style={{ padding: 0 }}>
          <LogoGraphic size={64} style={{ color: 'var(--white)' }} />
        </div>
        <h1 className="login-title">{isSignUp ? 'Create an account' : 'Welcome back'}</h1>
        <p className="login-subtitle">{isSignUp ? 'Sign up to get started' : 'Sign in to your account'}</p>
      </div>

      <div className="login-card">
        {/* Role Selector */}
        {(isSignUp || !isSignUp) && (
          <div className="role-tabs">
            <button className={`role-tab ${role === 'developer' ? 'active' : ''}`} onClick={() => { setRole('developer'); setEmail(''); setPassword(''); setError('') }}>
              Developer
            </button>
            <button className={`role-tab ${role === 'official' ? 'active' : ''}`} onClick={() => { setRole('official'); setEmail(''); setPassword(''); setError('') }}>
              Gov. Official
            </button>
          </div>
        )}

        <form className="login-form" onSubmit={handleAuth}>
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={16} />
              <input
                id="email"
                type="email"
                className="has-icon"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input
                id="password"
                type="password"
                className="has-icon"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p style={{ color: 'var(--red-500)', fontSize: '0.875rem' }}>{error}</p>}

          <button type="submit" className="btn btn-primary sign-in-btn" disabled={loading}>
            {loading ? (isSignUp ? 'Signing up…' : 'Signing in…') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <p className="login-footer">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(!isSignUp); setError(''); setEmail(''); setPassword('') }}>
            {isSignUp ? 'Sign in' : 'Sign up'}
          </a>
        </p>
      </div>


    </div>
  )
}
