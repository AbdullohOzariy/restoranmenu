# 🚀 Render.com'da Deploy Qilish Bo'yicha Qo'llanma

## 📋 Tayyorgarlik

### 1. GitHub Repository Yarating
```bash
cd /Users/bozorov/Desktop/restoran-menyu-tizimi

# Git init (agar yo'q bo'lsa)
git init

# Barcha fayllarni qo'shish
git add .
git commit -m "Initial commit - Restaurant Menu System"

# GitHub'ga push qilish
git remote add origin https://github.com/username/restoran-menyu-tizimi.git
git branch -M main
git push -u origin main
```

### 2. Render.com'da Hisob Yarating
1. [Render.com](https://render.com) ga o'ting
2. "Get Started for Free" tugmasini bosing
3. GitHub orqali ro'yxatdan o'ting

---

## 🎯 DEPLOY QILISH (Blueprint Method)

### Usul 1: Blueprint (Tavsiya Etiladi) ✅

Bu usul `render.yaml` faylini ishlatadi va database + web service'ni avtomatik yaratadi.

#### Qadamlar:

1. **Render Dashboard**'ga kiring
   - https://dashboard.render.com

2. **"New" > "Blueprint"** ni tanlang

3. **Repository'ni ulang:**
   - GitHub repository'ni tanlang
   - `restoran-menyu-tizimi` ni toping
   - "Connect" tugmasini bosing

4. **Blueprint'ni tekshiring:**
   - Render `render.yaml` faylini o'qiydi
   - 2 ta service ko'rsatiladi:
     - PostgreSQL Database
     - Web Service
   - "Apply" tugmasini bosing

5. **Deploy boshlanadi:**
   - Database yaratiladi (~2-3 daqiqa)
   - Web service build qilinadi (~5-7 daqiqa)
   - Avtomatik deploy bo'ladi

6. **URL olasiz:**
   - `https://restoran-menyu-tizimi.onrender.com`

---

## 🎯 DEPLOY QILISH (Manual Method)

### Usul 2: Qo'lda Yaratish

#### A. PostgreSQL Database Yaratish

1. Dashboard > **"New" > "PostgreSQL"**

2. **Ma'lumotlarni kiriting:**
   ```
   Name: restoran-menyu-tizimi-db
   Database: restaurant_db
   User: restaurant_user
   Region: Oregon (US West)
   Plan: Free
   ```

3. **"Create Database"** tugmasini bosing

4. **Internal Database URL'ni nusxalang:**
   - Dashboard > Database > Connection
   - Internal URL ni ko'chirib oling

#### B. Web Service Yaratish

1. Dashboard > **"New" > "Web Service"**

2. **Repository'ni ulang:**
   - GitHub repository'ni tanlang

3. **Ma'lumotlarni kiriting:**
   ```
   Name: restoran-menyu-tizimi
   Region: Oregon (US West)
   Branch: main
   Runtime: Node
   Build Command: npm install && npm run build && cd server && npm install
   Start Command: cd server && node index.js
   Plan: Free
   ```

4. **Environment Variables qo'shing:**
   - "Advanced" > "Add Environment Variable"
   ```
   NODE_ENV = production
   PORT = 3000
   DATABASE_URL = [Database Internal URL]
   ```

5. **"Create Web Service"** tugmasini bosing

---

## ⚙️ ENVIRONMENT VARIABLES

Render dashboard'da quyidagi o'zgaruvchilar sozlangan:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Eslatma:** `DATABASE_URL` Blueprint method'da avtomatik ulanadi.

---

## 🔍 BUILD LOGS TEKSHIRISH

Deploy jarayonida:

1. **Dashboard'dan service'ni oching**
2. **"Logs"** tabini tanlang
3. Quyidagi xabarlarni ko'rasiz:

```
==> Building...
==> npm install
==> npm run build
==> cd server && npm install
==> Build successful!

==> Starting server...
✅ PostgreSQL muvaffaqiyatli ulandi
📦 Database bo'sh. Boshlang'ich ma'lumotlar yuklanmoqda...
✅ Database muvaffaqiyatli to'ldirildi.
✅ Server is running on port 3000
📍 http://localhost:3000
```

---

## 🎉 DEPLOY MUVAFFAQIYATLI!

### Saytingiz tayyor:
🌐 **URL:** `https://restoran-menyu-tizimi.onrender.com`

### Admin panel:
1. O'ng pastdagi qulf tugmasini bosing
2. Parol: `admin`

---

## 🐛 MUAMMOLAR VA YECHIMLAR

### 1. Build Failed - "Cannot find module"
```bash
# render.yaml'da buildCommand'ni tekshiring:
buildCommand: |
  npm install
  npm run build
  cd server && npm install
```

### 2. Database Connection Error
```
❌ PostgreSQL ga ulanishda xato
```

**Yechim:**
- DATABASE_URL to'g'ri sozlanganini tekshiring
- Internal Database URL ishlatilganini tasdiqlang
- Database service "Available" statusida bo'lishi kerak

### 3. Port Error
```
Port 3000 allaqachon band
```

**Yechim:**
- Render avtomatik `PORT` environment variable beradi
- `server/index.js` da `process.env.PORT` ishlatilganini tekshiring

### 4. Free Tier Sleep Mode
Render free tier'da service 15 daqiqa ishlatilmasa "sleep" holatiga o'tadi.

**Yechim:**
- Birinchi request 30-60 soniya davom etishi mumkin
- Paid plan olish (7$/oy)
- Cron job bilan uyg'otib turish

### 5. Static Files 404
```
GET /assets/index.js 404
```

**Yechim:**
```javascript
// server/index.js'da tekshiring:
const buildPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(buildPath));
```

---

## 📊 RENDER FREE TIER LIMITLAR

- **RAM:** 512 MB
- **CPU:** Shared
- **Bandwidth:** 100 GB/oy
- **Build time:** 90 daqiqa/oy
- **Sleep:** 15 daqiqa faol bo'lmasa uxlaydi
- **Database:** 256 MB (90 kun ishlab, keyin o'chiriladi)

---

## 🔄 AUTO-DEPLOY

`render.yaml` da `autoDeploy: true` sozlangani uchun:

```bash
# GitHub'ga push qilganingizda avtomatik deploy bo'ladi
git add .
git commit -m "Update menu items"
git push

# Render avtomatik yangi versiyani deploy qiladi
```

---

## 📝 KEYINGI QADAMLAR

### Production uchun tavsiyalar:

1. **Custom Domain:**
   - Render > Settings > Custom Domain
   - DNS sozlamalari

2. **SSL (HTTPS):**
   - Render avtomatik Let's Encrypt beradi
   - Hech narsa qilish shart emas ✅

3. **Monitoring:**
   - Render > Metrics
   - CPU, Memory, Request counts

4. **Backups:**
   - Database > Backups
   - Manual yoki scheduled

5. **Paid Plan:**
   - Always-on server (uxlamaydi)
   - Ko'proq RAM/CPU
   - Priority support

---

## 🆘 YORDAM

### Render Documentation:
- https://render.com/docs

### Support:
- Render Community: https://community.render.com
- Email: support@render.com

### Loyiha Logs:
```bash
# Real-time logs
Dashboard > Service > Logs tab

# Shell access
Dashboard > Service > Shell tab
```

---

## ✅ CHECKLIST

Deploy qilishdan oldin:

- [ ] GitHub repository yaratildi va push qilindi
- [ ] `render.yaml` fayli mavjud
- [ ] `.gitignore` fayli mavjud (.env fayllar ignore qilingan)
- [ ] `package.json` da `start` script mavjud
- [ ] Database migration code `server/index.js` da bor
- [ ] Static files serving to'g'ri sozlangan

Deploy qilishdan keyin:

- [ ] Build muvaffaqiyatli
- [ ] Service "Available" holatida
- [ ] Database ulanishi ishlayapti
- [ ] Frontend ochiladi
- [ ] Admin panel ishlaydi
- [ ] Taomlar ko'rinadi

---

## 🎯 MUVAFFAQIYAT!

Agar hamma narsa to'g'ri bo'lsa:

🌐 **Live Site:** https://restoran-menyu-tizimi.onrender.com
📊 **Dashboard:** https://dashboard.render.com
🗄️ **Database:** PostgreSQL (Render managed)

**Tabriklayman! Loyihangiz Render'da live! 🎉**

---

**Oxirgi yangilanish:** 2024-11-21
**Platform:** Render.com
**Region:** Oregon (US West)

