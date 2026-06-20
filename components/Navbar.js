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
            <Link href="/" className="navbar-brand">
                {/* Mobilda faqat emoji, kattada to'liq nom */}
                <span className="brand-full">{t.brand}</span>
                <span className="brand-icon">⚽</span>
            </Link>

            <div className="navbar-right">
                <div className="lang-switcher">
                    {LANGS.map(l => (
                        <button key={l.code} onClick={() => changeLang(l.code)}
                                className={`lang-btn ${lang === l.code ? 'active' : ''}`} title={l.label}>
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
                            <span className="nav-link-full">{t.nav_results}</span>
                            <span className="nav-link-icon">📋</span>
                        </Link>
                        <button className="btn-logout" onClick={() => signOut({ callbackUrl: '/' })}>
                            <span className="nav-link-full">{t.nav_logout}</span>
                            <span className="nav-link-icon">🚪</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                            <span className="nav-link-full">{t.nav_login}</span>
                            <span className="nav-link-icon">🔑</span>
                        </Link>
                        <Link href="/registration" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                            <span className="nav-link-full">{t.nav_register}</span>
                            <span className="nav-link-icon">📝</span>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}