# 🚀 Phase-by-Phase Human Tasks - Quick Reference

**⚡ Quick lookup for manual tasks needed at each phase**

Full details in: `HUMAN_TASKS.md`

---

## 📋 Phase 0: Pre-Implementation

**Before you start coding:**

```bash
☐ Install Node.js 18+
☐ Install Git
☐ Prepare product information (names, prices, quantities)
☐ Gather product images (800x800px, square, < 5MB each)
```

---

## 📦 Phase 1: Project Setup

**Manual tasks:**

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env.local

# 3. Edit .env.local
# ⚠️ CRITICAL: Change ADMIN_PASSWORD=your_secure_password_here

# 4. Verify installation
ls node_modules | wc -l  # Should show 100+ packages
```

**⚠️ CRITICAL**: Change admin password in `.env.local` NOW!

---

## 💾 Phase 2: Database Setup

**Manual tasks:**

```bash
# 1. Initialize database
npm run db:init

# 2. Verify success
ls -lh database/products.db

# 3. Check database structure
sqlite3 database/products.db ".schema"
```

**Expected output**: "✅ Database initialization complete!"

---

## 🔧 Phase 3: Core Libraries

**Manual tasks:**

```bash
# Start dev server to test
npm run dev

# Open browser
http://localhost:3000

# Watch terminal for TypeScript errors
# Fix any errors before continuing
```

**Self-check:**
- ☐ No TypeScript errors
- ☐ Files compile successfully
- ☐ No console errors

---

## 🌐 Phase 4: API Routes

**Manual tasks:**

```bash
# Test API endpoints (after implementation)
# Open browser console and run:

# Test GET products
fetch('/api/products').then(r => r.json()).then(console.log)

# Expected: { success: true, data: [] }
```

**Self-check:**
- ☐ APIs return correct responses
- ☐ Error handling works
- ☐ No 500 errors

---

## 🎨 Phase 5: Components

**Manual tasks:**

**Color verification (use DevTools):**
```bash
# Check navigation bar background
# Should be: #8B9DC3 (Soft Slate Blue)

# Check badges background
# Should be: #F5F1E8 (Warm Cream)
```

**Mobile testing:**
```bash
# Open DevTools (F12)
# Toggle device toolbar (Ctrl+Shift+M)

☐ Test iPhone SE (375px) - 1 column
☐ Test iPad (768px) - 2 columns
☐ Test Desktop (1920px) - 4 columns
```

---

## 📄 Phase 6: Pages

**Manual tasks:**

**Test all pages:**
```bash
☐ Home page: http://localhost:3000
☐ Admin page: http://localhost:3000/admin

# Test login
☐ Try wrong password (should fail)
☐ Try correct password (should work)
```

**Mobile testing:**
```bash
☐ Navigation sticky on scroll
☐ Forms work on mobile
☐ Touch targets are 44px+
```

---

## 🧪 Phase 7: Testing

**COMPREHENSIVE MANUAL TESTING**

### Admin Panel Tests
```bash
☐ Login with password
☐ Add product with image
☐ Verify product appears in list
☐ Verify product shows on home page
☐ Delete product
☐ Verify product removed everywhere
☐ Test form validation (empty, negative values)
☐ Test image upload (JPEG, PNG, WebP)
☐ Test large file rejection (> 5MB)
```

### Home Page Tests
```bash
☐ Products display in grid
☐ Images load correctly
☐ Prices formatted with ₹
☐ Min order quantities show
☐ Responsive grid (1-4 columns based on screen)
```

### Mobile Device Tests (Real Device)
```bash
# 1. Find your local IP
hostname -I

# 2. On phone, visit: http://YOUR_IP:3000

☐ Test responsive layout
☐ Test image upload with camera
☐ Test touch interactions
☐ Verify numeric keyboards appear
```

### Design System Tests
```bash
☐ Colors match plan (Soft Slate Blue + Warm Cream)
☐ Typography is Inter font
☐ Spacing follows 8px grid
☐ Shadows are subtle
☐ No vibrant colors used
```

---

## 🚀 Phase 8: Deployment

**CRITICAL SECURITY TASKS:**

```bash
# 1. Review .env.local
☐ Strong password (12+ characters)
☐ No sensitive data in code

# 2. Git setup
git init
git add .
git commit -m "Initial commit"

# 3. Create GitHub repo
☐ Go to github.com
☐ Create new repository: "alakh-web"
☐ Make it private (recommended)

# 4. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/alakh-web.git
git branch -M main
git push -u origin main

# 5. Deploy to Vercel
☐ Sign up at vercel.com (use GitHub)
☐ Import your repository
☐ Add environment variables:
  - ADMIN_PASSWORD (use DIFFERENT password!)
  - NODE_ENV=production
☐ Deploy and wait

# 6. Test live site
☐ Visit your-project.vercel.app
☐ Test admin login
☐ Add test product
☐ Verify everything works
☐ Delete test product
```

**⚠️ Production Password**: Use a DIFFERENT, stronger password than local!

---

## 📊 Phase 9: Post-Deployment

**INITIAL DATA SETUP:**

```bash
# 1. Add real products
☐ Log into admin panel (production URL)
☐ Add all your prepared products
☐ Upload product images
☐ Verify all information correct

# 2. Quality check
☐ All products display correctly
☐ Images load fast
☐ Mobile layout works
☐ No broken images

# 3. Backup
☐ Download database file
☐ Save product images separately
```

---

## 🆘 Quick Troubleshooting

**Can't install dependencies?**
```bash
npm install --legacy-peer-deps
```

**Database won't initialize?**
```bash
rm database/products.db
npm run db:init
```

**Dev server won't start?**
```bash
# Kill port 3000
killall node
npm run dev
```

**Images won't upload?**
```bash
# Check folder exists
ls -la public/images/products/

# Create if missing
mkdir -p public/images/products
```

**Build fails?**
```bash
# Clear cache
rm -rf .next
npm run dev
```

---

## ✅ Before Each Phase Review

**Self-check before asking for code review:**

```bash
☐ All human tasks completed
☐ No console errors (browser + terminal)
☐ TypeScript compiles without errors
☐ Features work as expected
☐ Tested on mobile (DevTools minimum)
☐ Colors match design plan
☐ Code is formatted and clean
☐ Ready for review
```

---

## 📱 Quick Mobile Test Checklist

**Browser DevTools (Minimum):**
```bash
F12 → Toggle Device Toolbar (Ctrl+Shift+M)

☐ iPhone SE (375px)
☐ iPhone 12 (390px)
☐ iPad (768px)
☐ Desktop (1920px)
```

**Real Device (Highly Recommended):**
```bash
☐ Find IP: hostname -I
☐ Phone visit: http://YOUR_IP:3000
☐ Test camera upload
☐ Test touch interactions
```

---

## 🎯 Daily Development Routine

**Every time you start working:**

```bash
# 1. Navigate to project
cd "/home/kevin/Desktop/alakh web"

# 2. Pull latest changes (if using Git)
git pull

# 3. Start dev server
npm run dev

# 4. Open browser
# http://localhost:3000

# 5. Check HUMAN_TASKS.md for current phase tasks

# 6. Start coding!
```

**Before stopping work:**

```bash
# 1. Test your changes
# 2. Fix any errors
# 3. Commit to Git (after Phase 8)
git add .
git commit -m "Describe what you did"
git push
```

---

## 📞 Need Help?

**Check these files in order:**

1. `HUMAN_TASKS.md` - Complete task details
2. `PROJECT_SUMMARY.md` - Quick overview
3. `README.md` - Project documentation
4. Error messages in terminal/console
5. Ask your code reviewer

---

## 🎉 Quick Wins

**Feel accomplished after each phase:**

- ✅ Phase 1: Dependencies installed!
- ✅ Phase 2: Database created!
- ✅ Phase 3: Core logic works!
- ✅ Phase 4: APIs respond!
- ✅ Phase 5: Components render!
- ✅ Phase 6: Pages display!
- ✅ Phase 7: Everything tested!
- ✅ Phase 8: Deployed live!

**You're building something real! Keep going! 🚀**

---

**💡 Pro Tip**: Keep this file open in a second monitor or print it out!

**⏰ Time Estimate**: ~7-8 hours total coding + 1-2 hours testing/deployment
