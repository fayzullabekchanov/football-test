// pages/registration.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Registration() {
  const router = useRouter()
  const [form, setForm] = useState({ fullName: '', userName: '', password: '', passwordConfirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.passwordConfirm) {
      return setError('Parollar mos kelmadi')
    }

    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>⚽ RO'YXAT</h1>
          <p>Yangi hisob yaratish</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">F.I.O.</label>
            <input
              className="form-input"
              type="text"
              placeholder="Ism Familiya Sharif"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Login (username)</label>
            <input
              className="form-input"
              type="text"
              placeholder="username"
              value={form.userName}
              onChange={e => setForm({ ...form, userName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Parol</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Parolni tasdiqlang</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••"
              value={form.passwordConfirm}
              onChange={e => setForm({ ...form, passwordConfirm: e.target.value })}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Yaratilmoqda...' : 'Hisob yaratish'}
          </button>
        </form>

        <div className="auth-link">
          Hisobingiz bormi? <Link href="/login">Kirish</Link>
        </div>
      </div>
    </div>
  )
}
