// pages/api/admin/results.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Ruxsat yo\'q' })
  }

  if (req.method === 'GET') {
    const results = await prisma.anstest.findMany({
      include: { user: { select: { fullName: true, userName: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json(results)
  }


  if (req.method === 'DELETE') {
    const { id } = req.body
    await prisma.anstest.delete({ where: { id: parseInt(id) } })
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
