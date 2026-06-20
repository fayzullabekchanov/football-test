// components/Navbar.js
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useLang } from '../lib/useLang'
import { LANGS } from '../lib/i18n'

export default function Navbar() {
  const { data: session } = useSession()
  const { lang, changeLang, t } = useLang()

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">{t.brand}</Link>
      <div className="navbar-right">
        {/* Til tanlash */}
        <div className="lang-switcher">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className={`lang-btn ${lang === l.code ? 'active' : ''}`}
              title={l.label}
            >
              {l.flag} {l.code.toUpperCase()}
            </button>
          ))}
        </div>

        {session ? (
          <>
            <span className="navbar-user">👤 {session.user.fullName}</span>
            {session.user.role === 'ADMIN' && (
              <Link href="/admin" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                {t.nav_admin}
              </Link>
            )}
            <Link href="/anstest" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
              {t.nav_results}
            </Link>
            <button className="btn-logout" onClick={() => signOut({ callbackUrl: '/' })}>
              {t.nav_logout}
            </button>
          </>
        ) : (
          <>
            <Link href="/login">{t.nav_login}</Link>
            <Link href="/registration">{t.nav_register}</Link>
          </>
        )}
      </div>
    </nav>
  )
}
