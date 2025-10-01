# 🚀 Deploy Playground to Vercel NOW

Follow these steps to deploy in the next 5 minutes!

## ✅ Pre-deployment Checklist

- [ ] Git repository pushed to GitHub
- [ ] All files committed
- [ ] Playground builds locally without errors

## 🎯 Deployment Steps (Choose ONE option)

### Option A: Vercel CLI (Fastest - 2 minutes)

```bash
# 1. Install Vercel CLI (if not installed)
npm install -g vercel

# 2. Navigate to playground
cd /home/akhiping/Documents/baseline-surgeon/apps/playground

# 3. Login to Vercel
vercel login

# 4. Deploy to production
vercel --prod
```

**Follow the prompts:**
- "Set up and deploy?" → **Yes**
- "Which scope?" → Select your account
- "Link to existing project?" → **No**
- "What's your project's name?" → **baseline-surgeon-playground**
- "In which directory is your code located?" → **.**
- "Want to override the settings?" → **No**

**Done!** You'll get a URL like:
```
https://baseline-surgeon-playground.vercel.app
```

---

### Option B: Vercel Dashboard (3-4 minutes)

1. **Go to:** https://vercel.com/new

2. **Import your GitHub repo**

3. **Configure settings:**
   - Framework Preset: **Vite**
   - Root Directory: **apps/playground**
   - Build Command: **npm run build**
   - Output Directory: **dist**
   - Install Command: **npm install**

4. **Click "Deploy"**

5. **Wait 2-3 minutes** for build

6. **Visit your live site!**

---

## 📋 After Deployment

Once deployed, do these:

### 1. Test the site
- [ ] Visit the URL
- [ ] Try loading an example
- [ ] Click "Run Transform"
- [ ] Check explanations panel
- [ ] Test on mobile

### 2. Update README
```bash
# Edit README.md and replace:
[baseline-surgeon.dev/playground](https://baseline-surgeon.dev/playground)

# With your actual URL:
[your-actual-url.vercel.app](https://your-actual-url.vercel.app)
```

### 3. Update submission
- [ ] Add playground URL to Devpost
- [ ] Add URL to GitHub repo description
- [ ] Test URL in submission preview

### 4. Share it!
- [ ] Tweet about it
- [ ] Share in hackathon Discord
- [ ] Add to LinkedIn post

---

## 🔧 If Build Fails

### Error: "Module not found"

**Solution:** Install dependencies locally first to test:
```bash
cd apps/playground
npm install
npm run build
```

If that works locally, try deploying again.

### Error: "Workspace dependencies not found"

**Solution:** Vercel needs monorepo setup. In Vercel dashboard:
- Go to Settings → General
- Install Command: `cd ../.. && npm install && cd apps/playground && npm install`

Or build locally and deploy the `dist` folder only.

### Error: "Out of memory"

**Solution:** In `vite.config.ts`, add:
```typescript
build: {
  chunkSizeWarningLimit: 1000,
  rollupOptions: {
    output: {
      manualChunks: {
        monaco: ['@monaco-editor/react', 'monaco-editor']
      }
    }
  }
}
```

---

## 🎬 Quick Test Commands

Before deploying, test locally:

```bash
cd apps/playground

# Install dependencies
npm install

# Test dev server
npm run dev

# Test production build
npm run build
npm run preview
```

If all work locally, deployment will work!

---

## 📱 Post-Deploy Screenshot Checklist

For your demo video and submission, take screenshots of:

1. [ ] Homepage with first example loaded
2. [ ] Before/After panes with transformed code
3. [ ] Explanation panel showing MDN links
4. [ ] Example dropdown showing all options
5. [ ] Mobile view (responsive design)
6. [ ] Different Baseline target selected

---

## 🏆 Success Metrics

After deployment, you should have:

- ✅ Live URL that works
- ✅ All 10 examples load
- ✅ Transforms execute successfully
- ✅ Explanations show up
- ✅ Copy button works
- ✅ Responsive on mobile
- ✅ Fast load time (<3 seconds)

---

## 💡 Pro Tips

1. **Custom domain (optional):**
   - In Vercel dashboard → Settings → Domains
   - Add your domain (if you have one)
   - Update DNS records
   - Free SSL included!

2. **Auto-deployment:**
   - Once connected to GitHub
   - Every push to main = auto-deploy
   - Pull requests get preview URLs

3. **Performance:**
   - Vercel automatically optimizes
   - CDN distribution worldwide
   - HTTP/2 + Gzip compression
   - You don't need to do anything!

---

## 🚀 Deploy NOW!

**Run this single command:**

```bash
cd /home/akhiping/Documents/baseline-surgeon/apps/playground && vercel --prod
```

**That's it!** 🎉

The playground will be live in 2-3 minutes!

---

## Need Help?

If anything doesn't work:

1. Check the build logs in Vercel dashboard
2. Test `npm run build` locally first
3. Make sure all dependencies are in `package.json`
4. Check that Git repo is pushed to GitHub

**You've got this!** 🚀 