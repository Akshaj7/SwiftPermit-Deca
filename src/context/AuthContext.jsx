import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = {
  developer: {
    id: 'dev-001',
    name: 'Alex Rivera',
    email: 'alex@buildco.com',
    role: 'developer',
    company: 'BuildCo Construction',
    initials: 'AR',
  },
  official: {
    id: 'off-001',
    name: 'Jordan Lee',
    email: 'jlee@cityofchesterfield.gov',
    role: 'official',
    company: 'City of Chesterfield',
    initials: 'JL',
    department: 'Permitting & Zoning',
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sp_user')
    return saved ? JSON.parse(saved) : null
  })

  // Simulated database
  const getRegisteredUsers = () => {
    const saved = localStorage.getItem('sp_registered_users')
    if (saved) return JSON.parse(saved)
    // Seed with demo users
    const initial = {
      'alex@buildco.com': { ...DEMO_USERS.developer, password: 'demo1234' },
      'jlee@cityofchesterfield.gov': { ...DEMO_USERS.official, password: 'demo1234' }
    }
    localStorage.setItem('sp_registered_users', JSON.stringify(initial))
    return initial
  }

  const signup = (email, password, role, name) => {
    const users = getRegisteredUsers()
    if (users[email]) {
      throw new Error('An account with this email already exists.')
    }
    const newUser = {
      id: `${role.substring(0,3)}-${Date.now()}`,
      email,
      password,
      role,
      name: name || email.split('@')[0],
      initials: (name || email).substring(0,2).toUpperCase(),
    }
    users[email] = newUser
    localStorage.setItem('sp_registered_users', JSON.stringify(users))
    
    // Auto-login
    const { password: _, ...userData } = newUser
    setUser(userData)
    localStorage.setItem('sp_user', JSON.stringify(userData))
  }

  const loginWithCredentials = (email, password) => {
    const users = getRegisteredUsers()
    const foundUser = users[email]
    if (!foundUser) {
      throw new Error('No account found with this email.')
    }
    if (foundUser.password !== password) {
      throw new Error('Incorrect password.')
    }
    
    const { password: _, ...userData } = foundUser
    setUser(userData)
    localStorage.setItem('sp_user', JSON.stringify(userData))
  }

  // Legacy fast-login for Social / Demo overrides
  const login = (role) => {
    const userData = DEMO_USERS[role]
    setUser(userData)
    localStorage.setItem('sp_user', JSON.stringify(userData))
  }

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sp_settings')
    return saved ? JSON.parse(saved) : {
      groqKey: '',
      googleDriveConfig: { folderId: '', enabled: false }
    }
  })

  useEffect(() => {
    localStorage.setItem('sp_settings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('sp_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithCredentials, signup, logout, settings, updateSettings }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
