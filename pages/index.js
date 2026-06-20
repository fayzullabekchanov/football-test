// pages/index.js
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { useLang } from '../lib/useLang'

export default function Home() {
  const { data: session } = useSession()
  const { t } = useLang()

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero-card">
          <div className="hero-header">
            <h2><b>{t.home_title}</b></h2>
          </div>
          <div className="hero-body">
            <p>{t.home_p1}</p>
            <br />
            <p>{t.home_p2}</p>
            <br />
            <p>{t.home_p3}</p>
          </div>
          <div className="hero-footer">
            {session ? (
              <Link href="/maintest" className="btn-start">{t.home_btn_start}</Link>
            ) : (
              <Link href="/login" className="btn-start">{t.home_btn_login}</Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
