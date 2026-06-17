# ⚽ Futbol Taktik Test — Next.js + Neon + Vercel

## Loyiha tuzilmasi

```
football-test/
├── pages/
│   ├── api/
│   │   ├── auth/[...nextauth].js  ← Login/session
│   │   ├── register.js            ← Ro'yxatdan o'tish
│   │   ├── anstest.js             ← Natija saqlash/olish
│   │   └── admin/results.js       ← Admin API
│   ├── index.js       ← Bosh sahifa
│   ├── login.js       ← Kirish
│   ├── registration.js ← Ro'yxat
│   ├── maintest.js    ← 20 ta savol (asosiy)
│   ├── anstest.js     ← Foydalanuvchi natijalari
│   └── admin.js       ← Admin panel
├── components/
│   └── Navbar.js
├── lib/
│   └── prisma.js
├── prisma/
│   └── schema.prisma  ← Database jadvallari
├── styles/
│   └── globals.css
└── public/
    └── images/
        └── savollar/  ← 1.png, 2.png, ... 20.png (rasmlarni shu joyga qo'ying!)
```

---

## 🚀 VERCELGA DEPLOY QILISH — QADAMBA-QADAM

### 1-qadam: Neon PostgreSQL yaratish (BEPUL)
1. https://neon.tech ga o'ting → Sign Up
2. "New Project" bosing → nom bering
3. **Connection string** ni nusxalab oling:
   `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`

### 2-qadam: GitHub ga yuklash
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/SIZNING_USERNAME/football-test.git
git push -u origin main
```

### 3-qadam: Vercel deploy
1. https://vercel.com ga o'ting → Import Project → GitHub repo tanlang
2. **Environment Variables** ga quyidagilarni qo'shing:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Neondan olgan connection string |
| `NEXTAUTH_SECRET` | Ixtiyoriy uzun string (masalan: `my-super-secret-key-2024`) |
| `NEXTAUTH_URL` | `https://SIZNING-LOYIHA.vercel.app` |

3. Deploy bosing! ✅

### 4-qadam: Database jadvallarini yaratish
Deploy bo'lgandan keyin Vercel dashboard → Functions → yoki local:

```bash
npm install
npx prisma db push
```

Bu buyruq Neon'da jadvallarni avtomatik yaratadi.

### 5-qadam: Admin foydalanuvchi yaratish
Neon SQL Editor orqali (https://console.neon.tech):

```sql
-- Avval oddiy ro'yxatdan o'ting, keyin admin qiling:
UPDATE t_user SET role = 'ADMIN' WHERE "userName" = 'admin_username_ingiz';
```

---

## 📸 RASMLARNI QANDAY QO'SHISH

`public/images/savollar/` papkasiga original rasmlarni nusxalang:
- `1.png`, `2.png`, ..., `20.png`

Agar rasmlar boshqa nomda bo'lsa, `pages/maintest.js` dagi yo'lni o'zgartiring.

---

## 🔧 LOCAL ISHLATISH

```bash
npm install
# .env.local faylini yarating (.env.example dan nusxalang)
npx prisma generate
npx prisma db push
npm run dev
```

http://localhost:3000 da ochiladi.

---

## Saytdagi sahifalar

| URL | Kim ko'ra oladi |
|-----|-----------------|
| `/` | Hamma |
| `/login` | Kirmoqchi bo'lgan |
| `/registration` | Yangi foydalanuvchi |
| `/maintest` | Login bo'lgan USER |
| `/anstest` | Login bo'lgan USER (o'z natijalari) |
| `/admin` | Faqat ADMIN roli |
