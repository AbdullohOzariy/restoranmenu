# 🍽️ Restoran Menyu Tizimi

Digital menyu va filial boshqaruv tizimi. Mijozlar uchun zamonaviy menyu ko'rinishi va admin panel orqali to'liq boshqaruv.

## ✨ Xususiyatlar

- 📱 Responsive dizayn (mobil/planshet/desktop)
- 🏢 Ko'p filial boshqaruvi
- 📋 Kategoriyalar va taomlar boshqaruvi
- 💰 Har bir taom uchun ko'p variantlar (narxlar)
- 🎨 Brending sozlamalari (rang, logo)
- 🔐 Admin panel (parol himoyalangan)
- 🗄️ PostgreSQL ma'lumotlar bazasi

## 🚀 O'rnatish

**Talablar:** Node.js 16+, PostgreSQL 12+

### 1. Loyihani yuklab oling
```bash
git clone <repository-url>
cd restoran-menyu-tizimi
```

### 2. Frontend dependencies o'rnatish
```bash
npm install
```

### 3. Backend dependencies o'rnatish
```bash
cd server
npm install
cd ..
```

### 4. Database sozlash
PostgreSQL ma'lumotlar bazasini yarating:
```sql
CREATE DATABASE restaurant_db;
```

### 5. Environment o'zgaruvchilarini sozlang
`.env.local` faylini yarating (`.env.example` dan nusxa oling):
```env
DATABASE_URL=postgresql://username:password@localhost:5432/restaurant_db
PORT=3000
```

### 6. Loyihani ishga tushiring

**Development rejimida:**
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

**Production build:**
```bash
npm run build
cd server
npm start
```

## 📖 Foydalanish

- **Mijoz ko'rinishi:** `http://localhost:5173` (dev) yoki `http://localhost:3000` (production)
- **Admin panel:** O'ng pastdagi qulf tugmasini bosing, parol: `admin`

## 🛠️ Texnologiyalar

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Icons:** Lucide React

## 📝 Litsenziya

MIT
 