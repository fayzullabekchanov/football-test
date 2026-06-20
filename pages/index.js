// pages/index.js
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Home() {
  const { data: session } = useSession()

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero-card">
          <div className="hero-header">
            <h2>⚽</h2>
            <p>Futbol maydonidagi taktik fikrlash qobiliyatingizni baholash tizimi</p>
          </div>
          <div className="hero-body">
            <p>
              Ushbu test dasturida sizning futbol maydonidagi taktik fikrlash qobiliyatingiz o'rganiladi.
              Dastlab savollarni o'qing va har bir taklif etilayotgan taktik vaziyatdagi to'g'ri bo'lgan
              variantni belgilang.
            </p>
            <br />
            <p>
              Yosh futbolchilarning taktik fikrlarini baholashda 3 ta o'yin vaziyati ekranda taqdim etiladi.
              Har bir belgilangan o'yin vaziyatining har bir varianti <strong>0-ball, 1-ball, 2-ball, 3-ball</strong> bilan
              baholanadi va har bir berilgan o'yin vaziyati uchun vaqt alohida hisoblanadi.
            </p>
            <br />
            <p>Ishtrokingiz uchun rahmat! 🏆</p>
          </div>
          <div className="hero-footer">
            {session ? (
              <Link href="/maintest" className="btn-start">
                TESTNI BOSHLASH
              </Link>
            ) : (
              <Link href="/login" className="btn-start">
                BOSHLASH
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
