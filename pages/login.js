// pages/login.js
import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useLang } from '../lib/useLang'
import { LANGS } from '../lib/i18n'

export default function Login() {
  const { data: session } = useSession()
  const router = useRouter()
  const { lang, changeLang, t } = useLang()
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
      setError(t.login_error)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Til tanlash */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              style={{
                background: lang === l.code ? '#1a6b2f' : '#f0f0f0',
                color: lang === l.code ? 'white' : '#555',
                border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem',
                cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif'
              }}
            >
              {l.flag} {l.code.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="auth-logo">
          <h1>{t.login_title}</h1>
          <p>{t.login_subtitle}</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t.login_username}</label>
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
            <label className="form-label">{t.login_password}</label>
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
            {loading ? t.login_loading : t.login_btn}
          </button>
        </form>

        <div className="auth-link">
          {t.login_no_account} <Link href="/registration">{t.login_register_link}</Link>
        </div>
      </div>
    </div>
  )
}
