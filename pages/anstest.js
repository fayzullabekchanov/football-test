// pages/anstest.js
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { useLang } from '../lib/useLang'

export default function AnstestPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLang()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status])

  useEffect(() => {
    if (session) {
      fetch('/api/anstest')
        .then(r => r.json())
        .then(data => { setResults(data); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [session])

  if (status === 'loading' || loading) return (
    <><Navbar /><div className="spinner" style={{ paddingTop: '4rem' }}><div className="spinner-ring"></div></div></>
  )

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="page-title">{t.results_title}</h1>
        {results.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚽</div>
            <p>{t.results_empty}</p>
            <a href="/maintest" style={{ color: '#1a6b2f', fontWeight: 600, marginTop: '0.5rem', display: 'inline-block' }}>
              {t.results_start}
            </a>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="result-table">
              <thead>
                <tr>
                  <th rowSpan={2}>{t.results_th_name}</th>
                  <th colSpan={2}>{t.results_group(1)}</th>
                  <th colSpan={2}>{t.results_group(2)}</th>
                  <th colSpan={2}>{t.results_group(3)}</th>
                  <th rowSpan={2}>{t.results_th_total_ball}</th>
                  <th rowSpan={2}>{t.results_th_total_time}</th>
                </tr>
                <tr>
                  <th>{t.results_th_ball}</th><th>{t.results_th_time}</th>
                  <th>{t.results_th_ball}</th><th>{t.results_th_time}</th>
                  <th>{t.results_th_ball}</th><th>{t.results_th_time}</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, textAlign: 'left' }}>{r.user?.fullName}</td>
                    <td>{r.bal1}</td><td>{r.anstime1}s</td>
                    <td>{r.bal2}</td><td>{r.anstime2}s</td>
                    <td>{r.bal3}</td><td>{r.anstime3}s</td>
                    <td style={{ fontWeight: 700, color: '#1a6b2f' }}>{r.totalBall}</td>
                    <td>{r.totalAnstime}</td>
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
