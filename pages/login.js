// pages/login.js
import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Login() {
  const { data: session } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) router.push('/')
  }, [session])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      redirect: false,
      username: form.username,
      password: form.password,
    })

    setLoading(false)
    if (res?.error) {
      setError('Login yoki parol noto\'g\'ri')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>⚽ KIRISH</h1>
          <p>Taktik test tizimi</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Foydalanuvchi nomi</label>
            <input
              className="form-input"
              type="text"
              placeholder="username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
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
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Kiring...' : 'Kirish'}
          </button>
        </form>

        <div className="auth-link">
          Hisobingiz yo'qmi? <Link href="/registration">Ro'yxatdan o'ting</Link>
        </div>
      </div>
    </div>
  )
}
