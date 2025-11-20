# 🎛️ RENDER SETTINGS - TO'LIQ QO'LLANMA

## 📋 HOZIRGI SOZLAMALAR (render.yaml)

### 🌐 Web Service Settings

```yaml
name: restoran-menyu-tizimi
type: web
env: node
region: oregon (US West)
plan: free
branch: main
autoDeploy: true
```

#### Build Command:
```bash
npm install
npm run build
echo "📦 Verifying dist folder..."
ls -la dist/
echo "📋 Copying dist to server/dist..."
mkdir -p server/dist
cp -r dist/* server/dist/
echo "✅ Dist copied. Verifying..."
ls -la server/dist/
cd server && npm install
```

#### Start Command:
```bash
cd server && node index.js
```

#### Environment Variables:
- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL` (auto from database)

#### Health Check:
- Path: `/`
- Enabled: ✅

---

## 🗄️ DATABASE SETTINGS

```yaml
name: restoran-menyu-tizimi-db
type: PostgreSQL
plan: free
region: oregon (US West)
databaseName: restaurant_db
user: restaurant_user
ipAllowList: [] (open to all)
```

---

## 🎯 RENDER DASHBOARD SETTINGS

### Web Service Configuration:

#### 1️⃣ Basic Settings
```
Service Name:    restoran-menyu-tizimi
Environment:     Node
Region:          Oregon (US West)
Branch:          main
Root Directory:  (leave empty)
```

#### 2️⃣ Build & Deploy
```
Build Command:   (see render.yaml buildCommand)
Start Command:   cd server && node index.js
Auto-Deploy:     Yes
```

#### 3️⃣ Plan
```
Plan:            Free
Instance Type:   Shared
RAM:             512 MB
CPU:             Shared
Disk:            Ephemeral
```

#### 4️⃣ Environment Variables
Dashboard > Environment > Add Environment Variable:

| Key | Value | Source |
|-----|-------|--------|
| `NODE_ENV` | `production` | Manual |
| `PORT` | `3000` | Manual |
| `DATABASE_URL` | (auto) | From Database |

#### 5️⃣ Advanced Settings
```
Health Check Path:     /
Docker Command:        (not used)
Pre-Deploy Command:    (not used)
```

---

## 🗄️ DATABASE CONFIGURATION

### PostgreSQL Settings:

#### 1️⃣ Basic
```
Database Name:   restoran-menyu-tizimi-db
Database:        restaurant_db
User:            restaurant_user
Region:          Oregon (US West)
```

#### 2️⃣ Plan
```
Plan:            Free
Storage:         256 MB
Backups:         None (Free tier)
High Availability: No
```

#### 3️⃣ Access Control
```
IP Allow List:   [] (all allowed)
Internal Access: Yes (from web service)
External Access: Yes (from anywhere)
```

#### 4️⃣ Connection Info
```
Internal URL:    (use this for web service)
External URL:    (for external connections)
PSQL Command:    (for terminal access)
```

---

## 🔧 MANUAL SETTINGS (Agar Blueprint ishlamasa)

### Web Service Step-by-Step:

#### Step 1: Create Web Service
1. Dashboard > "New" > "Web Service"
2. Connect GitHub repository: `AbdullohOzariy/restoranmenu`

#### Step 2: Configure
```
Name:            restoran-menyu-tizimi
Region:          Oregon (US West)
Branch:          main
Runtime:         Node
Build Command:   npm install && npm run build && mkdir -p server/dist && cp -r dist/* server/dist/ && cd server && npm install
Start Command:   cd server && node index.js
Plan:            Free
```

#### Step 3: Environment Variables
Add manually:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=<paste from database internal URL>
```

#### Step 4: Advanced
```
Auto-Deploy:          On
Health Check Path:    /
```

### Database Step-by-Step:

#### Step 1: Create PostgreSQL
1. Dashboard > "New" > "PostgreSQL"

#### Step 2: Configure
```
Name:            restoran-menyu-tizimi-db
Database Name:   restaurant_db
User:            restaurant_user
Region:          Oregon (US West)
Plan:            Free
```

#### Step 3: Connect to Web Service
1. Copy Internal Database URL
2. Go to Web Service > Environment
3. Add `DATABASE_URL` variable with copied URL

---

## 📊 RECOMMENDED SETTINGS

### ✅ Free Tier Optimized:
```yaml
web:
  region: oregon         # US West (cheapest)
  plan: free            # $0/month
  auto-deploy: true     # Auto updates

database:
  region: oregon        # Same as web (faster)
  plan: free           # $0/month
  storage: 256MB       # Free tier limit
```

### 🚀 Production Ready (Paid):
```yaml
web:
  region: oregon
  plan: starter         # $7/month
  instance: 1GB RAM
  auto-deploy: true
  
database:
  region: oregon
  plan: starter         # $7/month
  storage: 1GB
  backups: daily
  high-availability: true
```

---

## 🎨 CUSTOM SETTINGS

### Custom Domain:
```
1. Dashboard > Service > Settings > Custom Domain
2. Add domain: example.com
3. Configure DNS:
   Type: CNAME
   Name: @
   Value: <render-url>
```

### SSL Certificate:
```
- Auto SSL: Yes (Let's Encrypt)
- Custom Certificate: (optional)
```

### Build Cache:
```
- Enable: Yes (faster builds)
- Clear: Manual (if needed)
```

---

## 🔄 AUTO-DEPLOY SETTINGS

### GitHub Integration:
```yaml
autoDeploy: true
branch: main
```

Qachon deploy bo'ladi:
- ✅ `git push origin main`
- ✅ GitHub'da main branch'ga merge
- ✅ render.yaml o'zgarganda
- ❌ Boshqa branch'larga push

### Deploy Notifications:
```
Dashboard > Service > Settings > Notifications
- Email: On
- Slack: (optional)
- Webhook: (optional)
```

---

## 📈 MONITORING SETTINGS

### Metrics:
```
Dashboard > Service > Metrics
- CPU Usage
- Memory Usage
- Request Count
- Response Time
- Error Rate
```

### Logs:
```
Dashboard > Service > Logs
- Real-time logs
- Search logs
- Download logs
```

### Alerts:
```
Dashboard > Service > Settings > Alerts
- CPU > 80%
- Memory > 80%
- Error rate > 5%
```

---

## 🔐 SECURITY SETTINGS

### Environment Variables:
```
- Never commit to Git
- Use Render dashboard only
- Auto-encrypted by Render
```

### IP Whitelist (Database):
```yaml
ipAllowList: []              # All IPs (not recommended)
ipAllowList: ["1.2.3.4"]    # Specific IP
```

### HTTPS:
```
- Auto enabled ✅
- Let's Encrypt certificate
- HTTP redirects to HTTPS
```

---

## 💰 COST SETTINGS

### Free Tier Limits:
```
Web Service:
- RAM: 512 MB
- CPU: Shared
- Sleep: 15 min inactivity
- Build: 90 min/month

Database:
- Storage: 256 MB
- Expires: 90 days
- No backups
```

### Upgrade Options:
```
Starter Plan ($7/month):
- 1 GB RAM
- Always-on (no sleep)
- Unlimited builds
- Priority support

Professional Plan ($25/month):
- 2 GB RAM
- Faster CPU
- Auto-scaling
- Advanced metrics
```

---

## 🛠️ ADVANCED SETTINGS

### Docker Settings:
```yaml
# Optional: Use Dockerfile instead
dockerCommand: docker run ...
dockerfilePath: ./Dockerfile
```

### Pre-Deploy Hook:
```yaml
preDeployCommand: |
  npm run test
  npm run lint
```

### Cron Jobs:
```yaml
cronJobs:
  - name: backup
    schedule: "0 2 * * *"    # Daily 2 AM
    command: npm run backup
```

### Scaling:
```
Free Tier: 1 instance (no scaling)
Paid Plans: Auto-scaling (1-10 instances)
```

---

## 📋 SETTINGS CHECKLIST

### Before Deploy:
- [ ] render.yaml configured
- [ ] GitHub repository connected
- [ ] Environment variables set
- [ ] Database created
- [ ] DATABASE_URL connected
- [ ] Build command correct
- [ ] Start command correct

### After Deploy:
- [ ] Service "Available" status
- [ ] Health check passing
- [ ] Logs show no errors
- [ ] URL accessible
- [ ] Database connected
- [ ] Static files served
- [ ] API endpoints working

---

## 🎯 OPTIMAL SETTINGS (Tavsiya)

### Sizning loyihangiz uchun:

```yaml
# Web Service
name: restoran-menyu-tizimi
region: oregon (US West - yaqin va tez)
plan: free (boshlash uchun, keyin starter)
auto-deploy: true (qulaylik)
health-check: / (asosiy sahifa)

# Database  
name: restoran-menyu-tizimi-db
region: oregon (web bilan bir joyda)
plan: free (boshlash uchun)
storage: 256 MB (yetarli)

# Environment
NODE_ENV: production (xavfsizlik)
PORT: 3000 (standart)
DATABASE_URL: auto (xavfsiz)
```

---

## 🔧 TROUBLESHOOTING SETTINGS

### Build Fails:
```yaml
# Try these settings:
buildCommand: |
  npm ci --legacy-peer-deps
  npm run build
  # ... rest
```

### Slow Build:
```yaml
# Enable build cache:
- Dashboard > Settings > Build Cache: On
```

### Service Sleeping:
```yaml
# Solution: Upgrade to Starter plan ($7/month)
# Or: Use cron-job.org to ping every 10 min
```

---

## 📞 SUPPORT SETTINGS

### Getting Help:
```
1. Community: community.render.com
2. Support: support@render.com
3. Docs: render.com/docs
4. Status: status.render.com
```

---

## ✅ YAKUNIY TAVSIYALAR

### Free Tier (Hozir):
```yaml
✅ region: oregon
✅ plan: free
✅ auto-deploy: true
✅ health-check: /
✅ NODE_ENV: production
```

### Production (Kelajakda):
```yaml
🚀 plan: starter ($7/month)
🚀 database: starter ($7/month)
🚀 custom-domain: yoursite.com
🚀 monitoring: enabled
🚀 backups: daily
```

---

**Hozirgi sozlamalar:** ✅ OPTIMAL (Free tier)  
**Tavsiya:** Deploy qiling, keyin zarurat bo'lsa Starter'ga o'ting  
**Jami xarajat:** $0/month (Free tier)  

**Render.yaml fayli to'liq sozlangan va tayyor! 🎉**

