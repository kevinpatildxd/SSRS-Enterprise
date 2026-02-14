# 📋 Human Tasks Checklist

This document lists all **manual tasks** you need to complete at various stages of the project. Check off each task as you complete it.

---

## 🚀 Phase 0: Pre-Implementation (Before Starting)

### ☐ Environment Preparation
- [ ] **Install Node.js 18+** (if not installed)
  ```bash
  node --version  # Should be 18.x or higher
  ```
- [ ] **Install npm or yarn** (comes with Node.js)
  ```bash
  npm --version
  ```
- [ ] **Install a code editor** (VS Code recommended)
- [ ] **Install Git** (for version control)
  ```bash
  git --version
  ```

### ☐ Content Preparation
- [ ] **Prepare product information** in a spreadsheet/document:
  - Product names
  - Prices (in ₹)
  - Minimum order quantities
  - Product descriptions (optional for future)

- [ ] **Gather product images:**
  - Format: JPEG, PNG, or WebP
  - Recommended size: 800x800px or larger
  - Square aspect ratio preferred
  - Clean, white backgrounds work best
  - Max file size: 5MB each

- [ ] **Create a placeholder image** (or use provided SVG)
  - For products without images initially

---

## 📦 Phase 1: Project Setup

### ☐ Installation Tasks
- [ ] **Navigate to project directory:**
  ```bash
  cd "/home/kevin/Desktop/alakh web"
  ```

- [ ] **Install dependencies:**
  ```bash
  npm install
  ```
  - Expected time: 2-5 minutes
  - Watch for errors (especially with sharp or better-sqlite3)
  - If errors occur, try: `npm install --legacy-peer-deps`

### ☐ Environment Configuration
- [ ] **Copy environment file:**
  ```bash
  cp .env.example .env.local
  ```

- [ ] **Edit `.env.local` and set values:**
  ```bash
  # Open in your editor
  nano .env.local  # or code .env.local
  ```

- [ ] **CRITICAL: Change admin password:**
  ```
  ADMIN_PASSWORD=your_secure_password_here
  ```
  ⚠️ **Security Note**: Use a strong password with:
  - At least 12 characters
  - Mix of letters, numbers, symbols
  - Not easily guessable

- [ ] **Verify environment variables:**
  ```
  ADMIN_PASSWORD=your_secure_password_here
  NODE_ENV=development
  DATABASE_PATH=./database/products.db
  MAX_FILE_SIZE=5242880
  ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
  ```

### ☐ Verification
- [ ] **Check all files were created:**
  ```bash
  ls -la
  ```
  - Should see: package.json, src/, database/, public/, etc.

- [ ] **Verify node_modules installed:**
  ```bash
  ls node_modules | wc -l
  ```
  - Should see 100+ packages

---

## 💾 Phase 2: Database Setup

### ☐ Database Initialization
- [ ] **Run database initialization:**
  ```bash
  npm run db:init
  ```

- [ ] **Verify success:**
  - Should see: "✅ Database initialization complete!"
  - Check file exists:
    ```bash
    ls -lh database/products.db
    ```

### ☐ Database Verification
- [ ] **Verify database structure:**
  ```bash
  sqlite3 database/products.db ".schema"
  ```
  - Should show products table with all columns

- [ ] **Check database is empty:**
  ```bash
  sqlite3 database/products.db "SELECT COUNT(*) FROM products;"
  ```
  - Should return: 0

### ☐ Troubleshooting (if needed)
- [ ] **If database init fails:**
  ```bash
  # Remove old database
  rm database/products.db

  # Try again
  npm run db:init
  ```

---

## 🧪 Phase 3-6: During Development

### ☐ Development Server
- [ ] **Start development server:**
  ```bash
  npm run dev
  ```

- [ ] **Verify server is running:**
  - Open browser: http://localhost:3000
  - Should see your home page (even if empty)

- [ ] **Check for errors in terminal:**
  - Watch for TypeScript errors
  - Watch for build errors
  - Fix errors before continuing

### ☐ Code Review (Self-Check Before Submitting to Reviewer)
- [ ] **Check file organization:**
  - All files in correct directories
  - Naming conventions followed
  - No duplicate files

- [ ] **Review your code:**
  - Remove console.logs (except intentional ones)
  - Remove commented-out code
  - Format code consistently
  - Add comments for complex logic

- [ ] **Test basic functionality:**
  - Pages load without errors
  - No 404 errors in browser console
  - TypeScript compiles without errors

---

## 🧪 Phase 7: Testing & Quality Assurance

### ☐ Manual Testing Tasks

#### Admin Panel Testing
- [ ] **Access admin page:**
  - Navigate to: http://localhost:3000/admin
  - Enter password (should be your .env.local password)
  - Verify login works

- [ ] **Test product creation:**
  - [ ] Fill out product form with valid data
  - [ ] Upload an image (test with real product image)
  - [ ] Submit form
  - [ ] Verify product appears in list
  - [ ] Check product shows on home page

- [ ] **Test form validation:**
  - [ ] Try submitting empty form (should show errors)
  - [ ] Try negative price (should reject)
  - [ ] Try zero or negative quantity (should reject)
  - [ ] Try uploading non-image file (should reject)
  - [ ] Try uploading file > 5MB (should reject)

- [ ] **Test product deletion:**
  - [ ] Delete a product
  - [ ] Confirm deletion dialog appears
  - [ ] Verify product is removed from list
  - [ ] Verify product removed from home page
  - [ ] Verify image file is deleted from public/images/products

- [ ] **Test image upload:**
  - [ ] Upload JPEG image (should work)
  - [ ] Upload PNG image (should work)
  - [ ] Upload WebP image (should work)
  - [ ] Verify images are optimized/compressed
  - [ ] Check image file sizes in public/images/products

#### Home Page Testing
- [ ] **Test product display:**
  - [ ] Products show in grid layout
  - [ ] Images load correctly
  - [ ] Product names display
  - [ ] Prices show with ₹ symbol
  - [ ] Min order quantities display
  - [ ] No products message shows when empty

### ☐ Mobile Testing Tasks

#### Browser DevTools Testing
- [ ] **Test responsive layouts:**
  - [ ] Open Chrome DevTools (F12)
  - [ ] Toggle device toolbar (Ctrl+Shift+M)
  - [ ] Test each device:
    - [ ] iPhone SE (375px) - single column
    - [ ] iPhone 12 (390px) - single column
    - [ ] iPad (768px) - 2 columns
    - [ ] Desktop (1920px) - 4 columns

- [ ] **Test mobile interactions:**
  - [ ] Touch targets are large enough (44px+)
  - [ ] Buttons are easy to tap
  - [ ] Forms work with touch
  - [ ] Scrolling is smooth

- [ ] **Test mobile keyboards:**
  - [ ] Price input shows decimal keyboard
  - [ ] Quantity input shows numeric keyboard
  - [ ] Text inputs show regular keyboard

#### Real Device Testing (If Possible)
- [ ] **Test on actual mobile device:**
  - [ ] Find your computer's local IP:
    ```bash
    # On Linux:
    hostname -I
    # Look for 192.168.x.x
    ```
  - [ ] Access from phone: `http://YOUR_IP:3000`
  - [ ] Test image upload with camera
  - [ ] Test touch interactions
  - [ ] Verify responsive layout

### ☐ Design System Verification
- [ ] **Check color usage:**
  - [ ] Navigation uses Soft Slate Blue (#8B9DC3)
  - [ ] Buttons use Soft Slate Blue
  - [ ] Prices use Soft Slate Blue
  - [ ] Badges use Warm Cream (#F5F1E8)
  - [ ] No vibrant colors used

- [ ] **Check typography:**
  - [ ] Font is Inter (or system fallback)
  - [ ] Font sizes are responsive
  - [ ] Minimum 16px on mobile (no iOS zoom)

- [ ] **Check spacing:**
  - [ ] Consistent padding/margins
  - [ ] Follows 8px grid
  - [ ] No cramped layouts

- [ ] **Check shadows:**
  - [ ] Subtle shadows on cards
  - [ ] Hover states work
  - [ ] No harsh shadows

### ☐ Accessibility Testing
- [ ] **Keyboard navigation:**
  - [ ] Tab through all interactive elements
  - [ ] Focus indicators are visible
  - [ ] Can submit forms with Enter
  - [ ] Can navigate without mouse

- [ ] **Color contrast:**
  - [ ] Text is readable
  - [ ] Links are distinguishable
  - [ ] Buttons have clear labels

- [ ] **Screen reader (optional but recommended):**
  - [ ] Test with screen reader extension
  - [ ] All images have alt text
  - [ ] Forms have proper labels

### ☐ Performance Testing
- [ ] **Check page load speed:**
  - [ ] Open DevTools Network tab
  - [ ] Reload page (Ctrl+Shift+R)
  - [ ] Check total load time (should be < 3 seconds)
  - [ ] Check image sizes (should be optimized)

- [ ] **Check for errors:**
  - [ ] Open Console tab (F12)
  - [ ] Should have no red errors
  - [ ] Fix any warnings if possible

---

## 🔐 Phase 8: Pre-Deployment

### ☐ Security Checklist
- [ ] **Review .env.local:**
  - [ ] Admin password is strong (12+ characters)
  - [ ] No sensitive data in code files
  - [ ] .env.local is in .gitignore (never committed)

- [ ] **Review .gitignore:**
  - [ ] node_modules/ is ignored
  - [ ] .env* is ignored (except .env.example)
  - [ ] database/*.db is ignored
  - [ ] Build files are ignored

- [ ] **Check for security issues:**
  - [ ] No API keys in code
  - [ ] No passwords in code
  - [ ] SQL queries use prepared statements
  - [ ] File uploads are validated

### ☐ Git Repository Setup
- [ ] **Initialize Git (if not done):**
  ```bash
  git init
  ```

- [ ] **Create .gitignore (already exists, verify):**
  ```bash
  cat .gitignore
  ```

- [ ] **Make initial commit:**
  ```bash
  git add .
  git commit -m "Initial commit - Product management system"
  ```

- [ ] **Create GitHub repository:**
  - [ ] Go to github.com
  - [ ] Click "New repository"
  - [ ] Name: "alakh-web" (or your choice)
  - [ ] Make it private (recommended) or public
  - [ ] Don't initialize with README (we have one)
  - [ ] Click "Create repository"

- [ ] **Connect to GitHub:**
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/alakh-web.git
  git branch -M main
  git push -u origin main
  ```

### ☐ Production Preparation
- [ ] **Review README.md:**
  - [ ] Update any project-specific information
  - [ ] Add any additional setup steps
  - [ ] Document your admin password location (for yourself only!)

- [ ] **Create production .env:**
  - [ ] Make note of environment variables needed for Vercel
  - [ ] ADMIN_PASSWORD (use different password for production!)
  - [ ] Other variables from .env.example

---

## 🚀 Phase 9: Deployment to Vercel

### ☐ Vercel Account Setup
- [ ] **Create Vercel account:**
  - [ ] Go to vercel.com
  - [ ] Click "Sign Up"
  - [ ] Sign up with GitHub (recommended)
  - [ ] Verify email if needed

### ☐ Deploy to Vercel
- [ ] **Import project:**
  - [ ] Click "Add New Project"
  - [ ] Import from GitHub
  - [ ] Select your "alakh-web" repository
  - [ ] Click "Import"

- [ ] **Configure project:**
  - [ ] Framework Preset: Next.js (auto-detected)
  - [ ] Root Directory: ./
  - [ ] Build Command: `npm run build` (default)
  - [ ] Output Directory: .next (default)

- [ ] **Add environment variables:**
  - [ ] Click "Environment Variables"
  - [ ] Add each variable:
    ```
    ADMIN_PASSWORD = your_production_password_here
    NODE_ENV = production
    DATABASE_PATH = ./database/products.db
    ```
  - [ ] ⚠️ Use a DIFFERENT password than local!

- [ ] **Deploy:**
  - [ ] Click "Deploy"
  - [ ] Wait for build to complete (2-5 minutes)
  - [ ] Check for build errors

### ☐ Post-Deployment Verification
- [ ] **Test live site:**
  - [ ] Open your Vercel URL (e.g., alakh-web.vercel.app)
  - [ ] Home page loads correctly
  - [ ] Navigate to /admin
  - [ ] Login with production password
  - [ ] Add a test product
  - [ ] Upload an image
  - [ ] Verify product shows on home page
  - [ ] Delete test product

- [ ] **Test on mobile device:**
  - [ ] Open live URL on phone
  - [ ] Test responsive layout
  - [ ] Test image upload with camera
  - [ ] Verify everything works

### ☐ Initial Data Setup
- [ ] **Add real products:**
  - [ ] Log into admin panel
  - [ ] Add all your prepared products
  - [ ] Upload product images
  - [ ] Verify all information is correct

- [ ] **Review home page:**
  - [ ] All products display correctly
  - [ ] Images load fast
  - [ ] Layout looks good
  - [ ] No broken images

---

## 📊 Phase 10: Post-Launch

### ☐ Maintenance Tasks
- [ ] **Create backup strategy:**
  - [ ] Download database file periodically
  - [ ] Save product images separately
  - [ ] Keep Git repository updated

- [ ] **Monitor site:**
  - [ ] Check Vercel dashboard for errors
  - [ ] Monitor site uptime
  - [ ] Check for any issues

- [ ] **Update products:**
  - [ ] Regular price updates
  - [ ] Add new products
  - [ ] Update images as needed
  - [ ] Remove discontinued products

### ☐ Optional Enhancements
- [ ] **Custom domain (optional):**
  - [ ] Purchase domain name
  - [ ] Add to Vercel project
  - [ ] Configure DNS

- [ ] **Analytics (optional):**
  - [ ] Add Google Analytics
  - [ ] Track page views
  - [ ] Monitor user behavior

---

## 🆘 Troubleshooting Checklist

### If Database Won't Initialize:
- [ ] Check Node.js version (18+)
- [ ] Delete products.db and try again
- [ ] Check file permissions
- [ ] Review error messages carefully

### If Development Server Won't Start:
- [ ] Check port 3000 isn't in use
- [ ] Delete .next folder and try again
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Reinstall dependencies

### If Images Won't Upload:
- [ ] Check file size (< 5MB)
- [ ] Check file type (JPEG, PNG, WebP only)
- [ ] Verify public/images/products folder exists
- [ ] Check folder permissions
- [ ] Review browser console for errors

### If Deployment Fails:
- [ ] Check build logs in Vercel dashboard
- [ ] Verify all environment variables are set
- [ ] Check for TypeScript errors
- [ ] Ensure database initialization works
- [ ] Review package.json scripts

### If Admin Login Fails:
- [ ] Check .env.local has ADMIN_PASSWORD set
- [ ] Verify password has no extra spaces
- [ ] Try restarting dev server
- [ ] Check browser console for errors
- [ ] Clear session storage

---

## 📝 Notes & Reminders

### Important Information to Document:

**Admin Credentials:**
```
Local Password: [WRITE DOWN SECURELY]
Production Password: [WRITE DOWN SECURELY]
```

**Vercel Project:**
```
Project URL: https://__________.vercel.app
Git Repository: https://github.com/________/alakh-web
```

**Important Files Locations:**
```
Database: ./database/products.db
Images: ./public/images/products/
Environment: ./.env.local (never commit this!)
```

---

## ✅ Phase Completion Checklist

Before moving to the next phase, ensure:

- [ ] All human tasks for current phase are completed
- [ ] No errors in terminal or browser console
- [ ] Code is committed to Git (after Phase 8)
- [ ] Ready for code review (if applicable)
- [ ] Documentation is updated if you made changes

---

## 🎯 Quick Start Reminder

**Every time you start working:**

```bash
# 1. Navigate to project
cd "/home/kevin/Desktop/alakh web"

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:3000

# 4. Start coding!
```

---

## 📞 Help & Resources

**If you get stuck:**
1. Check error messages carefully
2. Review documentation files
3. Check GitHub issues for similar problems
4. Ask your code reviewer

**Documentation Files:**
- `README.md` - Project overview
- `MOBILE_FEATURES.md` - Mobile optimization
- `UI_DESIGN_PLAN.md` - Design system
- `COLOR_REFERENCE.md` - Color guide
- `PROJECT_SUMMARY.md` - Quick reference

---

**💡 Tip**: Print this checklist or keep it open in a separate window while working!

**✨ Remember**: Take your time with each task. Quality over speed!
