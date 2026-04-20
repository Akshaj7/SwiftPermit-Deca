import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { PermitProvider } from './context/PermitContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <PermitProvider>
          <App />
        </PermitProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
)
