// pages/registration.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useLang } from '../lib/useLang'
import { LANGS } from '../lib/i18n'

export default function Registration() {
  const router = useRouter()
  const { lang, changeLang, t } = useLang()
  const [form, setForm] = useState({ fullName: '', userName: '', password: '', passwordConfirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.passwordConfirm) return setError(t.reg_error_match)
    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error) } else { router.push('/login') }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => changeLang(l.code)}
              style={{
                background: lang === l.code ? '#1a6b2f' : '#f0f0f0',
                color: lang === l.code ? 'white' : '#555',
                border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem',
                cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif'
              }}>
              {l.flag} {l.code.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="auth-logo">
          <h1>{t.reg_title}</h1>
          <p>{t.reg_subtitle}</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t.reg_fullname}</label>
            <input className="form-input" type="text" placeholder={t.reg_fullname_ph}
              value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t.reg_username}</label>
            <input className="form-input" type="text" placeholder="username"
              value={form.userName} onChange={e => setForm({ ...form, userName: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t.reg_password}</label>
            <input className="form-input" type="password" placeholder="••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t.reg_confirm}</label>
            <input className="form-input" type="password" placeholder="••••••"
              value={form.passwordConfirm} onChange={e => setForm({ ...form, passwordConfirm: e.target.value })} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? t.reg_loading : t.reg_btn}
          </button>
        </form>

        <div className="auth-link">
          {t.reg_has_account} <Link href="/login">{t.reg_login_link}</Link>
        </div>
      </div>
    </div>
  )
}
