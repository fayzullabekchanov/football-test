// pages/anstest.js
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'

export default function AnstestPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
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

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="spinner" style={{ paddingTop: '4rem' }}>
          <div className="spinner-ring"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="page-title">📋 NATIJALARIM</h1>

        {results.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚽</div>
            <p>Hali test topshirilmagan.</p>
            <a href="/maintest" style={{ color: '#1a6b2f', fontWeight: 600, marginTop: '0.5rem', display: 'inline-block' }}>
              Testni boshlash →
            </a>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="result-table">
              <thead>
                <tr>
                  <th rowSpan={2}>F.I.O.</th>
                  <th colSpan={2}>1-savol guruhi</th>
                  <th colSpan={2}>2-savol guruhi</th>
                  <th colSpan={2}>3-savol guruhi</th>
                  <th rowSpan={2}>Jami ball</th>
                  <th rowSpan={2}>Jami vaqt</th>
                </tr>
                <tr>
                  <th>Ball</th><th>Vaqt(s)</th>
                  <th>Ball</th><th>Vaqt(s)</th>
                  <th>Ball</th><th>Vaqt(s)</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, textAlign: 'left' }}>{r.user?.fullName}</td>
                    <td>{r.bal1}</td>
                    <td>{r.anstime1}</td>
                    <td>{r.bal2}</td>
                    <td>{r.anstime2}</td>
                    <td>{r.bal3}</td>
                    <td>{r.anstime3}</td>
                    <td style={{ fontWeight: 700, color: '#1a6b2f' }}>{r.totalBall}</td>
                    <td>{r.totalAnstime}s</td>
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
