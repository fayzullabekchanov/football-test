// pages/maintest.js
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

// 20 ta savol, 3 guruhga bo'lingan
// Guruh 1: 1-7 savol (bal1, anstime1)
// Guruh 2: 8-14 savol (bal2, anstime2)
// Guruh 3: 15-20 savol (bal3, anstime3)

const QUESTIONS = [
  // GURUH 1
  { id: 1, group: 1, text: '1-Savol?', answers: ['7','8','9','10','Zarba'] },
  { id: 2, group: 1, text: '2-savol?', answers: ['7','8','9','12'] },
  { id: 3, group: 1, text: '3-raqamdagi o\'yinchi qaysi jamoadoriga uzatadi? To\'g\'ri variantni toping.', answers: ['7','8','9','10','14'] },
  { id: 4, group: 1, text: '4-raqamdagi o\'yinchi qaysi jamoadoriga uzatadi? To\'g\'ri variantni toping.', answers: ['8','9','10','11'] },
  { id: 5, group: 1, text: '5-savol?', answers: ['6','7','8','10','11'] },
  { id: 6, group: 1, text: '6-savol?', answers: ['8','9','10','11','14'] },
  { id: 7, group: 1, text: '7-savol?', answers: ['7','8','9','10','11'] },
  // GURUH 2
  { id: 8, group: 2, text: '8-savol?', answers: ['6','8','9','11','12','13'] },
  { id: 9, group: 2, text: '9-savol?', answers: ['7','8','9','11','Zarba'] },
  { id: 10, group: 2, text: '10-savol?', answers: ['7','8','10','11','Zarba'] },
  { id: 11, group: 2, text: '11-savol?', answers: ['9','10','11','13','Zarba'] },
  { id: 12, group: 2, text: '12-savol?', answers: ['9','10','11','12','Zarba'] },
  { id: 13, group: 2, text: '13-savol?', answers: ['5','6','7','8','9','10','11'] },
  { id: 14, group: 2, text: '14-savol?', answers: ['6','9','10','11'] },
  // GURUH 3
  { id: 15, group: 3, text: '15-savol?', answers: ['3','7','8','11'] },
  { id: 16, group: 3, text: '16-savol?', answers: ['7','8','9','10','11'] },
  { id: 17, group: 3, text: '17-savol?', answers: ['6','7','9','10','11'] },
  { id: 18, group: 3, text: '18-savol?', answers: ['3','4','7','8','9','10'] },
  { id: 19, group: 3, text: '19-savol?', answers: ['2','4','5','6','7'] },
  { id: 20, group: 3, text: '20-savol?', answers: ['2','7','11','12','14'] },
]

const GROUP_RANGES = {
  1: [1, 7],
  2: [8, 14],
  3: [15, 20],
}

export default function MainTest() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState({}) // { questionId: answerIndex }
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  // Timer per group
  const [groupTimes, setGroupTimes] = useState({ 1: 0, 2: 0, 3: 0 })
  const timerRef = useRef(null)
  const currentGroup = QUESTIONS[currentQ]?.group || 1

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status])

  useEffect(() => {
    if (done) return
    timerRef.current = setInterval(() => {
      setGroupTimes(prev => ({
        ...prev,
        [currentGroup]: prev[currentGroup] + 1,
      }))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [currentGroup, done])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleAnswer = (answerIndex) => {
    const q = QUESTIONS[currentQ]
    setSelected(prev => ({ ...prev, [q.id]: answerIndex }))

    // Auto-advance after small delay
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(prev => prev + 1)
      } else {
        handleFinish({ ...selected, [q.id]: answerIndex })
      }
    }, 200)
  }

  const handleFinish = async (finalSelected) => {
    clearInterval(timerRef.current)
    setDone(true)
    setSubmitting(true)

    // Calculate scores per group (all answers get 1 point for now — scoring logic from original)
    const countGroup = (groupNum) => {
      const [start, end] = GROUP_RANGES[groupNum]
      let count = 0
      for (let id = start; id <= end; id++) {
        if (finalSelected[id] !== undefined) count++
      }
      return count
    }

    const bal1 = countGroup(1)
    const bal2 = countGroup(2)
    const bal3 = countGroup(3)
    const totalBall = bal1 + bal2 + bal3

    const times = groupTimes
    // Add time for final group (timer still running when last answer given)
    const anstime1 = times[1]
    const anstime2 = times[2]
    const anstime3 = times[3]
    const totalAnstime = anstime1 + anstime2 + anstime3

    const payload = {
      bal1: String(bal1),
      bal2: String(bal2),
      bal3: String(bal3),
      totalBall: String(totalBall),
      anstime1,
      anstime2,
      anstime3,
      totalAnstime: String(totalAnstime),
    }

    setResult(payload)

    await fetch('/api/anstest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSubmitting(false)
  }

  if (status === 'loading') {
    return (
      <div className="spinner" style={{ minHeight: '100vh', alignItems: 'center' }}>
        <div className="spinner-ring"></div>
      </div>
    )
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
                  <div style={{ background: '#f0f9f3', border: '2px solid #22883c', borderRadius: 12, padding: '1rem 1.5rem', minWidth: 120 }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>1-guruh ball</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a6b2f' }}>{result.bal1}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>{result.anstime1}s</div>
                  </div>
                  <div style={{ background: '#f0f9f3', border: '2px solid #22883c', borderRadius: 12, padding: '1rem 1.5rem', minWidth: 120 }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>2-guruh ball</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a6b2f' }}>{result.bal2}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>{result.anstime2}s</div>
                  </div>
                  <div style={{ background: '#f0f9f3', border: '2px solid #22883c', borderRadius: 12, padding: '1rem 1.5rem', minWidth: 120 }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>3-guruh ball</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a6b2f' }}>{result.bal3}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>{result.anstime3}s</div>
                  </div>
                </div>
                <div className="score-badge">Jami: {result.totalBall} ball</div>
                <p style={{ marginTop: '1rem', color: '#888', fontSize: '0.85rem' }}>
                  Umumiy vaqt: {formatTime(parseInt(result.totalAnstime))}
                </p>
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

  const q = QUESTIONS[currentQ]
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100
  const groupLabel = `${q.group}-guruh`
  const isNewGroup = currentQ === 0 || QUESTIONS[currentQ - 1]?.group !== q.group

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f1' }}>
      {/* Test Header */}
      <div className="test-header">
        <span className="user-name">👤 {session?.user?.fullName}</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{groupLabel}</span>
          <span className="timer">{formatTime(groupTimes[currentGroup])}</span>
        </div>
      </div>

      <div className="test-container">
        {/* Progress */}
        <div className="progress-text">{currentQ + 1} / {QUESTIONS.length} savol</div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {isNewGroup && (
          <div className="group-label-wrap">
            <span className="group-label">⚽ {groupLabel} boshlanadi</span>
          </div>
        )}

        {/* Question Card */}
        <div className="question-card" key={q.id}>
          <div className="question-header">
            <div className="question-number">Savol {q.id}</div>
            <h2>{q.text}</h2>
          </div>

          <div className="question-body">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/savollar/${q.id}.png`}
              alt={`Savol ${q.id}`}
              className="question-img"
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>

          <div className="question-footer">
            <div className="answer-group">
              {q.answers.map((ans, idx) => (
                <button
                  key={idx}
                  className={`answer-btn ${selected[q.id] === idx ? 'selected' : ''}`}
                  onClick={() => handleAnswer(idx)}
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation hint */}
        <p style={{ textAlign: 'center', color: '#999', fontSize: '0.8rem', marginTop: '1rem' }}>
          Javobni tanlasangiz keyingi savolga o'tadi
        </p>
      </div>
    </div>
  )
}
