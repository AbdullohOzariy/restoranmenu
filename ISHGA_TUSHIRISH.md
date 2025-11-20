# Loyihani ishga tushirish bo'yicha qo'llanma
Muvaffaqiyatlar! 🎉

---

```
cd server && npm start 2>&1 | tee server.log
# Loglarni ko'rish

psql postgres -c "CREATE DATABASE restaurant_db;"
psql postgres -c "DROP DATABASE restaurant_db;"
# Database'ni reset qilish

pkill -f "vite"
pkill -f "node server/index.js"
# Hamma jarayonlarni to'xtatish
```bash

## QULAYLIK KOMANDALAR

Production: http://localhost:3000

```
NODE_ENV=production npm start
cd server
# Server ishga tushirish (production)

npm run build
# Frontend build
```bash

## PRODUCTION BUILD

```
npm install
```bash
### Xato: "vite: command not found"

`.env.local` fayli bor va to'g'ri formatda ekanligini tekshiring.
### Xato: "DATABASE_URL topilmadi"

```
brew services restart postgresql@14
# Qayta ishga tushirish

brew services list | grep postgresql
# PostgreSQL ishlab turganini tekshirish
```bash
### Xato: "PostgreSQL ga ulanishda xato"

```
kill -9 <PID>
# Process'ni to'xtatish

lsof -i :3000
# Portni kim ishlatayotganini topish
```bash
### Xato: "Port 3000 allaqachon band"

## MUAMMOLAR VA YECHIMLAR

3. Parol: `admin`
2. Admin panelga kirish uchun: o'ng pastdagi qulf tugmasini bosing
1. Mijoz ko'rinishi: http://localhost:5173

## 6-QADAM: Brauzerni ochish

```
➜  Network: use --host to expose
➜  Local:   http://localhost:5173/

VITE v6.2.0  ready in 500 ms
```
Ko'rinish:

```
npm run dev
```bash
Boshqa terminal oynasida:

## 5-QADAM: Frontend ishga tushirish

```
Database populated successfully.
✅ PostgreSQL muvaffaqiyatli ulandi
📍 http://localhost:3000
✅ Server is running on port 3000
```
Ko'rinish:

```
npm start
cd server
```bash
Yangi terminal oynasida:

## 4-QADAM: Serverni ishga tushirish

```
DATABASE_URL=postgresql://restaurant_user:your_password@localhost:5432/restaurant_db
```env
Agar foydalanuvchi yaratgan bo'lsangiz:

```
PORT=3000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/restaurant_db
```env

`.env.local` faylini tekshiring va to'g'rilang:

## 3-QADAM: Environment o'zgaruvchilari

```
\q
# Chiqish

GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO restaurant_user;
CREATE USER restaurant_user WITH PASSWORD 'your_password';
# Foydalanuvchi yaratish (ixtiyoriy)

CREATE DATABASE restaurant_db;
# Database yaratish

psql postgres
# PostgreSQL ga kirish
```bash
### Database yaratish:

```
brew services start postgresql@14
brew install postgresql@14
```bash
### macOS (Homebrew):

## 2-QADAM: PostgreSQL o'rnatish va sozlash

```
cd ..
npm install
cd server
# Backend dependencies  

npm install
# Frontend dependencies
```bash

## 1-QADAM: Dependencies o'rnatish


