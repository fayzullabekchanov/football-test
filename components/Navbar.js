// components/Navbar.js
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">⚽ TAKTIK TEST</Link>
      <div className="navbar-right">
        {session ? (
          <>
            <span className="navbar-user">👤 {session.user.fullName}</span>
            {session.user.role === 'ADMIN' && (
              <Link href="/admin" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                Admin
              </Link>
            )}
            <Link href="/anstest" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
              Natijalarim
            </Link>
            <button className="btn-logout" onClick={() => signOut({ callbackUrl: '/' })}>
              Chiqish
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Kirish</Link>
            <Link href="/registration">Ro'yxatdan o'tish</Link>
          </>
        )}
      </div>
    </nav>
  )
}
