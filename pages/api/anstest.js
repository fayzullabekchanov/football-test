// pages/api/anstest.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '../../lib/prisma'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) return res.status(401).json({ error: 'Tizimga kiring' })

  if (req.method === 'POST') {
    const { bal1, bal2, bal3, totalBall, anstime1, anstime2, anstime3, totalAnstime } = req.body

    const saved = await prisma.anstest.create({
      data: {
        bal1: String(bal1 ?? ''),
        bal2: String(bal2 ?? ''),
        bal3: String(bal3 ?? ''),
        totalBall: String(totalBall ?? ''),
        anstime1: parseInt(anstime1) || 0,
        anstime2: parseInt(anstime2) || 0,
        anstime3: parseInt(anstime3) || 0,
        totalAnstime: String(totalAnstime ?? ''),
        userId: parseInt(session.user.id),
      },
    })

    return res.status(200).json({ success: true, id: saved.id })
  }

  if (req.method === 'GET') {
    const results = await prisma.anstest.findMany({
      where: { userId: parseInt(session.user.id) },
      include: { user: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json(results)
  }

  res.status(405).end()
}
