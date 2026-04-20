import { createContext, useContext, useState, useEffect } from 'react'

const PermitContext = createContext(null)

const INITIAL_PERMITS = [
  {
    id: 'SP-2026-001',
    projectName: 'Oak Street Mixed-Use Development',
    type: 'Commercial',
    address: '142 Oak Street, Chesterfield, MO',
    description: 'New 4-story mixed-use building with retail on ground floor and residential units above.',
    submitted: '2026-03-10',
    updated: '2026-03-18',
    status: 'review',
    applicant: 'dev-001',
    comment: 'Awaiting structural engineer sign-off.',
  },
  {
    id: 'SP-2026-002',
    projectName: 'Maple Avenue Residential Addition',
    type: 'Residential',
    address: '87 Maple Avenue, Chesterfield, MO',
    description: 'Rear addition to existing single-family home. Adding 400 sq ft to kitchen and master bedroom.',
    submitted: '2026-03-15',
    updated: '2026-03-20',
    status: 'approved',
    applicant: 'dev-001',
    comment: 'All documents verified. Approved.',
  },
  {
    id: 'SP-2026-003',
    projectName: 'River Park Retail Renovation',
    type: 'Commercial',
    address: '500 River Park Blvd, Chesterfield, MO',
    description: 'Interior renovation of 2,000 sq ft retail space. No structural changes.',
    submitted: '2026-03-22',
    updated: '2026-03-22',
    status: 'submitted',
    applicant: 'dev-001',
    comment: '',
  },
  {
    id: 'SP-2026-004',
    projectName: 'Industrial Warehouse Expansion',
    type: 'Industrial',
    address: '1200 Commerce Drive, Chesterfield, MO',
    description: 'Adding 5,000 sq ft warehouse extension, loading dock, and fire suppression system.',
    submitted: '2026-03-05',
    updated: '2026-03-12',
    status: 'rejected',
    applicant: 'dev-001',
    comment: 'Setback requirements not met. Resubmit with revised site plan.',
  },
  {
    id: 'SP-2026-005',
    projectName: 'Downtown Office Tower',
    type: 'Commercial',
    address: '900 Main Street, Chesterfield, MO',
    description: '12-story office tower with underground parking. 120,000 sq ft total floor area.',
    submitted: '2026-03-28',
    updated: '2026-03-28',
    status: 'submitted',
    applicant: 'dev-001',
    comment: '',
  },
]

const INITIAL_ACTIVITY = [
  { id: 1, text: 'Permit SP-2026-001 moved to Under Review', type: 'blue', time: '2 hours ago' },
  { id: 2, text: 'Permit SP-2026-002 was Approved', type: 'green', time: 'Yesterday at 3:45 PM' },
  { id: 3, text: 'New permit SP-2026-005 submitted', type: 'blue', time: 'Today at 9:12 AM' },
  { id: 4, text: 'Permit SP-2026-004 was Rejected', type: 'red', time: 'Mar 12, 2026' },
  { id: 5, text: 'Permit SP-2026-003 received initial review', type: 'yellow', time: 'Yesterday' },
]

export function PermitProvider({ children }) {
  const [permits, setPermits] = useState(() => {
    const saved = localStorage.getItem('sp_permits')
    return saved ? JSON.parse(saved) : INITIAL_PERMITS
  })

  const [activity, setActivity] = useState(() => {
    const saved = localStorage.getItem('sp_activity')
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY
  })

  useEffect(() => {
    localStorage.setItem('sp_permits', JSON.stringify(permits))
  }, [permits])

  useEffect(() => {
    localStorage.setItem('sp_activity', JSON.stringify(activity))
  }, [activity])

  const addPermit = (permitData) => {
    const id = `SP-2026-${String(permits.length + 1).padStart(3, '0')}`
    const newPermit = {
      ...permitData,
      id,
      status: 'submitted',
      submitted: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
      comment: '',
      applicant: 'dev-001',
    }
    setPermits(prev => [newPermit, ...prev])
    addActivity(`New permit ${id} submitted for ${permitData.projectName}`, 'blue')
    return id
  }

  const updatePermitStatus = (id, status, comment = '') => {
    setPermits(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status, comment, updated: new Date().toISOString().split('T')[0] }
          : p
      )
    )
    const verb = status === 'approved' ? 'approved ✓' : status === 'rejected' ? 'rejected ✗' : 'updated'
    const type = status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'blue'
    addActivity(`Permit ${id} was ${verb}`, type)
  }

  const addActivity = (text, type = 'blue') => {
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setActivity(prev => [{ id: Date.now(), text, type, time: `Today at ${time}` }, ...prev.slice(0, 9)])
  }

  const stats = {
    active: permits.filter(p => ['submitted', 'review'].includes(p.status)).length,
    pending: permits.filter(p => p.status === 'submitted').length,
    approved: permits.filter(p => p.status === 'approved').length,
    rejected: permits.filter(p => p.status === 'rejected').length,
  }

  return (
    <PermitContext.Provider value={{ permits, activity, addPermit, updatePermitStatus, stats }}>
      {children}
    </PermitContext.Provider>
  )
}

export const usePermits = () => useContext(PermitContext)
