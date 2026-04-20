import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, Shield, Database, Cloud, User, CheckCircle } from 'lucide-react';

const SettingsPage = () => {
  const { user, settings, updateSettings } = useAuth();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = () => {
    updateSettings(localSettings);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="settings-container" style={{ maxWidth: '800px' }}>
      <div className="section-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <Shield className="text-emerald" size={24} />
          <h3 style={{ margin: 0 }}>AI Configuration</h3>
        </div>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Configure your AI processing engine. SwiftPermit uses Groq Cloud for instant, high-fidelity zoning analysis.
        </p>
        
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Groq API Key</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="gsk_..."
            value={localSettings.groqKey}
            onChange={(e) => setLocalSettings({...localSettings, groqKey: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-200)' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.5rem' }}>
            Your key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
      </div>

      <div className="section-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <Cloud className="text-emerald" size={24} />
          <h3 style={{ margin: 0 }}>Cloud Storage</h3>
        </div>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Connect your Google Drive to automatically sync approved permits and decision letters.
        </p>

        <div style={{ background: 'var(--gray-50)', padding: '1.5rem', borderRadius: '12px', border: '1px dashed var(--gray-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Database size={20} className="text-gray-400" />
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>Google Drive Integration</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', margin: 0 }}>Automatically backup all permit documents.</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" disabled>Connect Drive</button>
          </div>
        </div>
      </div>

      <div className="section-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <User className="text-emerald" size={24} />
          <h3 style={{ margin: 0 }}>Account Details</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Full Name</label>
            <p style={{ fontWeight: 600, margin: 0 }}>{user?.name}</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Email Address</label>
            <p style={{ fontWeight: 600, margin: 0 }}>{user?.email}</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>Role</label>
            <p style={{ fontWeight: 600, margin: 0, textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} /> Save Changes
        </button>
        {saveStatus === 'success' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--emerald)', fontWeight: 600 }}>
            <CheckCircle size={18} /> Settings saved!
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
