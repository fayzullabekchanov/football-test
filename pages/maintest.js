// pages/maintest.js
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

// Har guruh uchun to'g'ri javob va ball qiymatlari
// slvt qiymati: 1, 2, 3 = ball; 0 = noto'g'ri (0 ball)
const GROUPS = [
  {
    id: 1,
    // 7 ta variant, har biri uchun ball (0 = noto'g'ri)
    answers: [
      { label: '7',    ball: 3 },
      { label: '8',    ball: 2 },
      { label: '9',    ball: 1 },
      { label: '10',   ball: 0 },
      { label: 'Zarba',ball: 0 },
    ],
  },
  {
    id: 2,
    answers: [
      { label: '6',    ball: 3 },
      { label: '8',    ball: 1 },
      { label: '9',    ball: 0 },
      { label: '11',   ball: 0 },
      { label: '12',   ball: 2 },
      { label: '13',   ball: 0 },
    ],
  },
  {
    id: 3,
    answers: [
      { label: '3',    ball: 1 },
      { label: '7',    ball: 0 },
      { label: '8',    ball: 3 },
      { label: '11',   ball: 2 },
    ],
  },
]

export default function MainTest() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [currentGroup, setCurrentGroup] = useState(0) // 0,1,2
  const [scores, setScores] = useState([null, null, null]) // ball har guruh uchun
  const [times, setTimes] = useState([0, 0, 0]) // sekund har guruh uchun
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [answered, setAnswered] = useState(false)

  const secondsRef = useRef(0)
  const minutesRef = useRef(0)
  const timerRef = useRef(null)
  const [displayTime, setDisplayTime] = useState('00:00')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status])

  // Timer har guruh boshida qayta ishga tushadi
  useEffect(() => {
    if (done) return
    secondsRef.current = 0
    minutesRef.current = 0
    setDisplayTime('00:00')

    timerRef.current = setInterval(() => {
      secondsRef.current++
      if (secondsRef.current >= 60) {
        minutesRef.current++
        secondsRef.current = 0
      }
      const m = String(minutesRef.current).padStart(2, '0')
      const s = String(secondsRef.current).padStart(2, '0')
      setDisplayTime(`${m}:${s}`)
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentGroup, done])

  const handleAnswer = (ball) => {
    if (answered) return
    setAnswered(true)
    clearInterval(timerRef.current)

    const elapsedSeconds = minutesRef.current * 60 + secondsRef.current

    const newScores = [...scores]
    newScores[currentGroup] = ball

    const newTimes = [...times]
    newTimes[currentGroup] = elapsedSeconds

    setScores(newScores)
    setTimes(newTimes)

    setTimeout(() => {
      if (currentGroup < 2) {
        setCurrentGroup(currentGroup + 1)
        setAnswered(false)
      } else {
        finishTest(newScores, newTimes)
      }
    }, 400)
  }

  const finishTest = async (finalScores, finalTimes) => {
    setDone(true)
    setSubmitting(true)

    const bal1 = finalScores[0] ?? 0
    const bal2 = finalScores[1] ?? 0
    const bal3 = finalScores[2] ?? 0
    const totalBall = bal1 + bal2 + bal3

    const anstime1 = finalTimes[0] ?? 0
    const anstime2 = finalTimes[1] ?? 0
    const anstime3 = finalTimes[2] ?? 0
    const totalSeconds = anstime1 + anstime2 + anstime3
    const mkk = Math.floor(totalSeconds / 60)
    const skk = totalSeconds - mkk * 60
    const totalAnstime = totalSeconds < 60 ? `${skk} s` : `${mkk} m ${skk} s`

    const payload = {
      bal1: String(bal1),
      bal2: String(bal2),
      bal3: String(bal3),
      totalBall: String(totalBall),
      anstime1,
      anstime2,
      anstime3,
      totalAnstime,
    }

    setResult(payload)

    try {
      await fetch('/api/anstest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (e) {
      console.error(e)
    }

    setSubmitting(false)
  }

  if (status === 'loading') {
    return <div className="spinner" style={{ minHeight: '100vh', alignItems: 'center' }}><div className="spinner-ring"></div></div>
  }

  if (done) {
    return (
        <div style={{ minHeight: '100vh', background: '#f0f4f1', padding: '2rem 1rem' }}>
          <div className="test-container">
            <div className="done-screen">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <h2>TEST TUGADI!</h2>
              {submitting ? (
                  <p>Natijalar saqlanmoqda...</p>
              ) : result ? (
                  <>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', margin: '1.5rem 0' }}>
                      {[1,2,3].map(i => (
                          <div key={i} style={{ background: '#f0f9f3', border: '2px solid #22883c', borderRadius: 12, padding: '1rem 1.5rem', minWidth: 120 }}>
                            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>{i}-vaziyat ball</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a6b2f' }}>{result[`bal${i}`]}</div>
                            <div style={{ fontSize: '0.75rem', color: '#999' }}>{result[`anstime${i}`]}s</div>
                          </div>
                      ))}
                    </div>
                    <div className="score-badge">Jami: {result.totalBall} ball</div>
                    <p style={{ marginTop: '1rem', color: '#888', fontSize: '0.85rem' }}>Umumiy vaqt: {result.totalAnstime}</p>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <a href="/anstest" style={{ background: '#1a6b2f', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                        Natijalarimni ko'rish
                      </a>
                      <a href="/" style={{ background: '#f5f5f5', color: '#333', padding: '0.75rem 1.5rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                        Bosh sahifa
                      </a>
                    </div>
                  </>
              ) : null}
            </div>
          </div>
        </div>
    )
  }

  const group = GROUPS[currentGroup]

  return (
      <div style={{ minHeight: '100vh', background: '#f0f4f1' }}>
        <div className="test-header">
          <span className="user-name">👤 {session?.user?.fullName}</span>
          <span className="timer">{displayTime}</span>
        </div>

        <div className="test-container">
          {/* Progress */}
          <div className="progress-text">{currentGroup + 1} / 3 vaziyat</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${((currentGroup + 1) / 3) * 100}%` }}></div>
          </div>

          <div className="question-card" key={currentGroup}>
            <div className="question-header" style={{ background: currentGroup === 0 ? '#0ea5e9' : currentGroup === 1 ? '#8b5cf6' : '#f59e0b' }}>
              <div className="question-number">{currentGroup + 1}-vaziyat</div>
              <h2>Quyidagi o'yin vaziyatida to'g'ri variantni tanlang</h2>
            </div>

            <div className="question-body">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                  src={`/images/savollar/${group.id}.png`}
                  alt={`Vaziyat ${group.id}`}
                  className="question-img"
                  onError={e => { e.target.style.display = 'none' }}
              />
            </div>

            <div className="question-footer">
              <div className="answer-group">
                {group.answers.map((ans, idx) => (
                    <button
                        key={idx}
                        className={`answer-btn`}
                        onClick={() => handleAnswer(ans.ball)}
                        disabled={answered}
                        style={{ opacity: answered ? 0.6 : 1 }}
                    >
                      {ans.label}
                    </button>
                ))}
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#999', fontSize: '0.8rem', marginTop: '1rem' }}>
            Javobni tanlasangiz keyingi vaziyatga o'tadi
          </p>
        </div>
      </div>
  )
}
