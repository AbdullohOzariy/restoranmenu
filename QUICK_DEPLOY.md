# 🚀 Quick Deploy Commands

## GitHub Push Qilish
```bash
# Current directory
cd /Users/bozorov/Desktop/restoran-menyu-tizimi

# Git status
git status

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment - Fixed all configurations"

# Push (agar remote mavjud bo'lsa)
git push origin main

# Agar remote yo'q bo'lsa, yarating:
# 1. GitHub'da yangi repository yarating
# 2. Keyin:
git remote add origin https://github.com/YOUR_USERNAME/restoran-menyu-tizimi.git
git branch -M main
git push -u origin main
```

## Render Deploy (Blueprint Method)

1. **Render.com'ga kiring:** https://dashboard.render.com

2. **New Blueprint:**
   - Dashboard > "New" > "Blueprint"
   - GitHub repository'ni ulang
   - `restoran-menyu-tizimi` ni tanlang
   - "Connect" > "Apply"

3. **Deploy Kuting:**
   - Database: ~2-3 daqiqa
   - Web Service: ~5-7 daqiqa
   - Tayyor! ✅

## Tekshirish

```bash
# Logs ko'rish
# Dashboard > Service > Logs

# Shell ochish
# Dashboard > Service > Shell

# Database tekshirish
# Dashboard > Database > Connect
```

## URL

Deploy tugagach:
- 🌐 **Live Site:** https://restoran-menyu-tizimi.onrender.com
- 🔐 **Admin:** O'ng pastdagi qulf, parol: `admin`

---

Batafsil qo'llanma: `RENDER_DEPLOY.md`

