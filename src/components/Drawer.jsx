import React from 'react';
import { X } from 'lucide-react';

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      <div 
        className={`drawer-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose} 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
      />
      <div 
        className={`drawer ${isOpen ? 'active' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '500px',
          background: 'white',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
            <X size={24} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
