# 🚀 ONE-CLICK DEPLOYMENT GUIDE
## For Non-Programmers - No SSH or Commands Needed!

---

## ✨ Super Easy 3-Step Deployment

### Step 1: Set Up CapRover (One Time Only)

1. **Open your CapRover Dashboard** in your web browser
   - Example: `https://captain.yourdomain.com`

2. **Click "Apps"** in the left sidebar

3. **Click "One-Click Apps/Databases"**
   - Search for **"PostgreSQL"**
   - Click **"Install"**
   - Leave default settings
   - Click **"Deploy"**
   - Wait 30 seconds

### Step 2: Create Your App

1. **Click "Apps"** again in sidebar

2. **Click "Create New App"**
   - App Name: `damday-village`
   - ✅ Check "Has Persistent Data" (if using SQLite)
   - Click **"Create App"**

3. **Go to your new app**: Click `damday-village` in the app list

### Step 3: Deploy Your Code

#### Method A: Via GitHub (Recommended - Auto-Deploy!)

1. In your app, click **"Deployment"** tab

2. Scroll to **"Method 3: Deploy from Github/Bitbucket/Gitlab"**

3. Click **"Connect to GitHub"**
   - Authorize CapRover
   - Select repository: `spacewinky9-dev/untitled`
   - Branch: `copilot/debug-validate-outputs-logs` (or `main`)

4. Click **"Save & Update"**

5. **Click "Trigger Build"** - Your app will deploy automatically!

6. **From now on**: Every time you push to GitHub, CapRover deploys automatically! ✨

#### Method B: Upload Files (Alternative)

1. Download this repository as ZIP from GitHub

2. Extract the ZIP file

3. In CapRover app → **"Deployment"** tab

4. **Click "Upload File"**
   - Select the extracted folder or create a `.tar.gz` file
   - Click **"Upload & Deploy"**

5. Wait 2-3 minutes for build to complete

---

## 🔧 Configure Your App (Required)

### Set Environment Variables

1. **In your app**, click **"App Configs"** tab

2. Scroll to **"Environment Variables"** section

3. Click **"Bulk Edit"**

4. **Copy and paste this** (update the values in CAPS):

```env
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@srv-captain--postgres:5432/damdayvillage
NEXTAUTH_SECRET=YOUR_SUPER_SECRET_KEY_MINIMUM_32_CHARACTERS_LONG_HERE
NEXTAUTH_URL=https://damday-village.YOUR_DOMAIN.com
ADMIN_EMAIL=admin@damdayvillage.com
ADMIN_PASSWORD=YOUR_SECURE_PASSWORD_HERE
ADMIN_NAME=Damday Admin
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
BLOCKCHAIN_NETWORK=mainnet
BLOCKCHAIN_CHAIN_ID=1337
CONSENSUS_MIN_STAKE=1000
CONSENSUS_BLOCK_REWARD=10
```

5. Click **"Save & Restart"** at the bottom

6. Wait 30 seconds for app to restart

---

## 🔒 Enable HTTPS (Required)

1. **In your app**, scroll to **"HTTP Settings"** section

2. Click **"Enable HTTPS"**
   - CapRover automatically gets free SSL certificate
   - Wait 1-2 minutes

3. ✅ Enable **"Force HTTPS"** - redirects HTTP to HTTPS

4. Click **"Save & Update"**

---

## 🌐 Add Your Domain (Optional)

1. **In your app**, find **"App Name"** section

2. Click **"Connect New Domain"**

3. Enter: `damday-village.yourdomain.com`

4. Click **"Update"**

5. **Update DNS** (in your domain registrar):
   - Type: `A Record`
   - Host: `damday-village`
   - Points to: `YOUR_CAPROVER_SERVER_IP`
   - TTL: `3600`

6. Wait 5-30 minutes for DNS to propagate

---

## ✅ Verify It's Working

### Check Your App

1. **Visit**: `https://damday-village.yourdomain.com`
   - Or: `http://damday-village.captain.yourdomain.com`

2. You should see the **Damday Village Homepage**!

### Login to Admin

1. **Visit**: `https://damday-village.yourdomain.com/admin/login`

2. **Login**:
   - Email: `admin@damdayvillage.com`
   - Password: (the one you set in environment variables)

3. **⚠️ IMPORTANT**: Change your password immediately!
   - Click your profile → Settings → Change Password

---

## 📊 Monitor Your App

### View Logs (Check for Errors)

1. **In your app**, click **"App Logs"** tab

2. **Real-time logs** show here

3. **Look for**:
   - ✅ "Server listening on port 3000"
   - ✅ "Database connected"
   - ❌ "Error" messages (fix if any)

### Check App Status

1. **In your app**, look at the top
   - 🟢 Green = Running
   - 🟡 Yellow = Building
   - 🔴 Red = Error

2. **If red**, check logs for errors

---

## 🆘 Troubleshooting

### Problem: Build Failed

**Solution**:
1. Check **App Logs** for error message
2. Verify **all environment variables** are set
3. Try **"Clear Cache"** button
4. Click **"Trigger Build"** again

### Problem: App Won't Start

**Solution**:
1. Check environment variables are correct
2. Verify `DATABASE_URL` format matches database type
3. Check app has enough RAM (512MB minimum)
4. Restart: **"Save & Restart"**

### Problem: Can't Login to Admin

**Solution**:
1. Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in environment variables
2. Verify `NEXTAUTH_SECRET` is set (32+ characters)
3. Check `NEXTAUTH_URL` matches your domain
4. Try clearing browser cookies

### Problem: HTTPS Not Working

**Solution**:
1. Verify domain DNS points to CapRover IP
2. Wait 5-10 minutes for Let's Encrypt
3. Try **"Re-enable HTTPS"**
4. Check CapRover firewall allows ports 80, 443

### Problem: Database Connection Error

**Solution**:
1. Check PostgreSQL is running (Apps → postgres)
2. Verify `DATABASE_URL` format is correct
3. Check database password matches
4. Restart both database and app

---

## 🔄 Update Your App

### Auto-Update (GitHub Connected)

If you connected GitHub:
1. **Push changes** to your GitHub branch
2. **CapRover automatically deploys** new version
3. **Check logs** to see deployment progress
4. **Done!** No manual steps needed

### Manual Update

1. Download latest code from GitHub

2. **In your app** → **"Deployment"** tab

3. Upload new files

4. Click **"Upload & Deploy"**

5. Wait for build to complete

---

## 🎉 You're Done!

Your Damday Village is now live with:

✅ **Automatic Deployment** (if GitHub connected)
✅ **Secure HTTPS**
✅ **Professional Domain**
✅ **Admin Dashboard**
✅ **Blockchain Integration**
✅ **Database Backups**
✅ **Zero Downtime Updates**

---

## 📋 Quick Checklist

Before going live, make sure:

- [ ] App is deployed and running (green status)
- [ ] HTTPS is enabled
- [ ] Admin login works
- [ ] Homepage loads correctly
- [ ] Database is connected (check logs)
- [ ] Admin password changed from default
- [ ] Environment variables are set
- [ ] Domain DNS is configured (if using custom domain)
- [ ] Database backups are enabled

---

## 🆘 Need Help?

### Check Documentation

- **DEPLOYMENT.md** - Detailed deployment guide
- **ENV.md** - All environment variables explained
- **DEBUGGING-REPORT.md** - Common issues and solutions

### View App Logs

Always check **App Logs** first - most issues are shown there!

### CapRover Support

- Forum: https://github.com/caprover/caprover/discussions
- Docs: https://caprover.com/docs

---

## 🎊 Congratulations!

You've successfully deployed Damday Village without writing a single command! 🚀

Your smart carbon-free village platform is now live and ready to:
- **Sell organic products** 🌿
- **Book homestays** 🏡
- **Track carbon credits** ♻️
- **Manage community** 👥
- **Integrate blockchain** ⛓️

**Next Steps:**
1. Explore admin dashboard
2. Add products and homestays
3. Customize your village
4. Share with your community!

---

**Powered by DamChain Blockchain** - Million times faster than Bitcoin 💚
