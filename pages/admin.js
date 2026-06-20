// pages/admin.js
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { useLang } from '../lib/useLang'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLang()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') router.push('/')
  }, [status, session])

  const fetchResults = () => {
    fetch('/api/admin/results')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setResults(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchResults() }, [])

  const handleDelete = async (userId, name) => {
    if (!confirm(t.admin_confirm(name))) return
    await fetch('/api/admin/results', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    setResults(prev => prev.filter(r => r.userId !== userId))
  }

  if (status === 'loading' || loading) return (
    <><Navbar /><div className="spinner" style={{ paddingTop: '4rem' }}><div className="spinner-ring"></div></div></>
  )

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="page-title">{t.admin_title}</h1>
        <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {t.admin_count} <strong>{results.length}</strong>
        </p>
        {results.length === 0 ? (
          <div className="empty-state"><p>{t.admin_empty}</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="result-table">
              <thead>
                <tr>
                  <th>{t.admin_th_name}</th>
                  <th>{t.admin_group(1)} {t.admin_th_ball}</th>
                  <th>{t.admin_group(1)} {t.admin_th_time}</th>
                  <th>{t.admin_group(2)} {t.admin_th_ball}</th>
                  <th>{t.admin_group(2)} {t.admin_th_time}</th>
                  <th>{t.admin_group(3)} {t.admin_th_ball}</th>
                  <th>{t.admin_group(3)} {t.admin_th_time}</th>
                  <th>{t.admin_th_total_ball}</th>
                  <th>{t.admin_th_total_time}</th>
                  <th>{t.admin_th_action}</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, textAlign: 'left' }}>
                      {r.user?.fullName}
                      <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 400 }}>@{r.user?.userName}</div>
                    </td>
                    <td>{r.bal1}</td><td>{r.anstime1}s</td>
                    <td>{r.bal2}</td><td>{r.anstime2}s</td>
                    <td>{r.bal3}</td><td>{r.anstime3}s</td>
                    <td style={{ fontWeight: 700, color: '#1a6b2f' }}>{r.totalBall}</td>
                    <td>{r.totalAnstime}</td>
                    <td>
                      <button onClick={() => handleDelete(r.userId, r.user?.fullName)}
                        style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.3rem 0.7rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem' }}>
                        {t.admin_delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
