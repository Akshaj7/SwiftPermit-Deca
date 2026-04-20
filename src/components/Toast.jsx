import { CheckCircle, XCircle, Info } from 'lucide-react'

const ICONS = {
  success: <CheckCircle size={18} />,
  error:   <XCircle size={18} />,
  info:    <Info size={18} />,
}

export default function Toast({ toasts }) {
  if (!toasts.length) return null
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type || 'success'}`}>
          {ICONS[t.type] || ICONS.info}
          {t.msg}
        </div>
      ))}
    </div>
  )
}
