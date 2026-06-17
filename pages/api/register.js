// pages/api/register.js
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { fullName, userName, password, passwordConfirm } = req.body

  if (!fullName || !userName || !password) {
    return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' })
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ error: 'Parollar mos kelmadi' })
  }

  if (password.length < 2) {
    return res.status(400).json({ error: 'Parol kamida 2 ta belgidan iborat bo\'lishi kerak' })
  }

  const existing = await prisma.user.findUnique({ where: { userName } })
  if (existing) {
    return res.status(400).json({ error: 'Bu foydalanuvchi nomi band' })
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      fullName,
      userName,
      password: hashed,
      role: 'USER',
    },
  })

  res.status(200).json({ success: true })
}
