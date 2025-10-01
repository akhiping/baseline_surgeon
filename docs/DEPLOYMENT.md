# Deployment Guide

This guide covers deploying the Baseline Surgeon Playground to various hosting platforms.

## Prerequisites

- Git repository pushed to GitHub/GitLab/Bitbucket
- Node.js 18+ installed locally
- Account on chosen platform (Vercel, Netlify, etc.)

---

## Vercel (Recommended)

Vercel is the easiest and fastest option for deploying Vite + React apps.

### Option 1: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to playground directory**
   ```bash
   cd apps/playground
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   # Deploy to preview
   vercel
   
   # Deploy to production
   vercel --prod
   ```

5. **Follow prompts:**
   - Setup and deploy? **Yes**
   - Which scope? Choose your account
   - Link to existing project? **No** (first time)
   - Project name? **baseline-surgeon-playground** (or your choice)
   - Directory? **./apps/playground**
   - Override settings? **No**

6. **Done!** Vercel will give you a URL like:
   ```
   https://baseline-surgeon-playground.vercel.app
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Go to** https://vercel.com/new

2. **Import Git Repository**
   - Click "Import Git Repository"
   - Select your repo
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/playground`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Click "Deploy"**

5. **Wait ~2-3 minutes** for build to complete

6. **Visit your live site!**

### Automatic Deployments

Once connected to Git:
- **Every push to `main`** → Auto-deploy to production
- **Every pull request** → Preview deployment
- **Instant rollbacks** if needed

---

## Netlify

Alternative to Vercel, equally good.

### Option 1: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Navigate to playground**
   ```bash
   cd apps/playground
   ```

3. **Build the app**
   ```bash
   npm install
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

5. **Follow prompts** to create new site

### Option 2: Netlify Dashboard

1. **Go to** https://app.netlify.com/start

2. **Connect to Git provider**

3. **Select repository**

4. **Configure build settings:**
   - **Base directory**: `apps/playground`
   - **Build command**: `npm run build`
   - **Publish directory**: `apps/playground/dist`

5. **Click "Deploy site"**

### Custom Domain on Netlify

1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records at your registrar
4. Wait for SSL certificate (automatic)

---

## GitHub Pages

Free option, but slightly more setup.

1. **Add to `vite.config.ts`:**
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/baseline-surgeon/', // Your repo name
   });
   ```

2. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

3. **Add to `package.json` scripts:**
   ```json
   {
     "scripts": {
       "deploy": "vite build && gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable in GitHub:**
   - Go to repo Settings → Pages
   - Source: `gh-pages` branch
   - Save

6. **Visit:** `https://yourusername.github.io/baseline-surgeon/`

---

## Custom Domain Setup

### For Vercel

1. **Go to** Project Settings → Domains
2. **Add domain**: `playground.baseline-surgeon.dev`
3. **Add DNS records at your registrar:**
   ```
   Type: CNAME
   Name: playground
   Value: cname.vercel-dns.com
   ```
4. **Wait for SSL** (automatic, ~5 minutes)

### For Netlify

1. **Go to** Site Settings → Domain management
2. **Add custom domain**
3. **Add DNS records:**
   ```
   Type: CNAME
   Name: playground
   Value: your-site.netlify.app
   ```
4. **SSL is automatic**

---

## Environment Variables

If you need environment variables:

### Vercel
```bash
vercel env add VITE_API_KEY
```

Or in dashboard: Settings → Environment Variables

### Netlify
In dashboard: Site settings → Environment variables

**Note:** Vite env vars must start with `VITE_`

---

## Build Optimization

### 1. Enable Compression

Already handled by Vercel/Netlify automatically!

### 2. Split Chunks

Already configured in Vite by default.

### 3. Tree Shaking

Vite does this automatically in production builds.

### 4. Bundle Analysis

```bash
npm install -D rollup-plugin-visualizer
```

Add to `vite.config.ts`:
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});
```

Run build to see bundle size breakdown.

---

## Monitoring

### Vercel Analytics

Enable in dashboard: Settings → Analytics (free)

### Web Vitals

Already tracked by Vercel automatically!

---

## Troubleshooting

### Build Fails: "Module not found"

**Solution:** Make sure all dependencies are in `package.json`, not just `devDependencies`.

```bash
# If using workspace packages
npm install @baseline-surgeon/core @baseline-surgeon/transforms
```

### "404 on refresh"

**Solution:** SPA routing needs rewrites. Already configured in `vercel.json`!

### Build succeeds but blank page

**Check:**
1. Browser console for errors
2. Base path in `vite.config.ts`
3. Import paths (should be relative)

### Slow builds

**Solution:** Vercel/Netlify cache dependencies automatically. First build is slow, subsequent builds are fast.

---

## Performance Checklist

- ✅ Code splitting (Vite handles this)
- ✅ Tree shaking (automatic)
- ✅ Minification (automatic)
- ✅ Gzip/Brotli compression (CDN handles this)
- ✅ CDN distribution (Vercel/Netlify included)
- ✅ HTTPS (automatic with free SSL)
- ✅ HTTP/2 (automatic)

---

## Quick Deploy Script

Add to root `package.json`:

```json
{
  "scripts": {
    "deploy:playground": "cd apps/playground && npm run build && vercel --prod"
  }
}
```

Then deploy with:
```bash
npm run deploy:playground
```

---

## Summary

**Recommended**: Use Vercel with GitHub integration

**Fastest**: `vercel --prod` from CLI

**Free tier limits:**
- Vercel: Unlimited projects, 100GB bandwidth/month
- Netlify: 100GB bandwidth/month
- GitHub Pages: 100GB bandwidth/month

All are more than enough for a hackathon project!

---

## Post-Deployment

1. ✅ Test the live site
2. ✅ Update README with live URL
3. ✅ Add URL to Devpost submission
4. ✅ Share on social media
5. ✅ Update package.json homepage field

**Your playground is now live! 🚀** 