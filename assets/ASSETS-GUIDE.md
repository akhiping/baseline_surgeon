# 📦 Assets Guide - Baseline Surgeon

## 🎨 What's in This Folder

All your logo assets in various sizes for different purposes:

```
assets/
├── logo.svg              # 1.4M - Original vector (scalable)
├── logo.png              # 1.4M - Original raster
├── logo-512x512.png      # 242K - App icon / large displays
├── logo-social.png       # 440K - GitHub/social media preview (1280x640)
├── favicon.ico           # 2.2K - Browser tab icon
├── favicon-32x32.png     # 1.4K - Small favicon
└── favicon-64x64.png     # 4.2K - Retina favicon
```

---

## 📋 Usage Guide

### 1. **README.md** (Hero Image)
```markdown
<p align="center">
  <img src="./assets/logo.svg" alt="Baseline Surgeon" width="200"/>
</p>

<h1 align="center">Baseline Surgeon</h1>
```

### 2. **Website Favicon** (HTML)
```html
<!-- In <head> section -->
<link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="64x64" href="/assets/favicon-64x64.png">
```

### 3. **GitHub Social Preview**
1. Go to GitHub repo → **Settings** → **Options**
2. Scroll to **Social preview**
3. Click **Edit** → Upload `assets/logo-social.png`
4. Save

### 4. **Playground (apps/playground/index.html)**
```html
<head>
  <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
  <meta property="og:image" content="https://your-vercel-url/assets/logo-social.png">
  <meta name="twitter:image" content="https://your-vercel-url/assets/logo-social.png">
</head>
```

### 5. **npm Package (package.json)**
```json
{
  "name": "@baseline-surgeon/core",
  "icon": "./assets/logo.png"
}
```

### 6. **VS Code Extension (Future)**
```json
{
  "icon": "assets/logo-512x512.png"
}
```

---

## 🎯 File Specifications

| File | Size | Purpose | Where Used |
|------|------|---------|-----------|
| `logo.svg` | Vector | Scalable logo | README, docs, print |
| `logo.png` | 1024x1024 | High-res raster | General use |
| `logo-512x512.png` | 512x512 | App icons | VS Code, PWA |
| `logo-social.png` | 1280x640 | Social media | GitHub, Twitter, LinkedIn |
| `favicon.ico` | 32x32 | Browser tab | Website `<head>` |
| `favicon-32x32.png` | 32x32 | Standard favicon | Modern browsers |
| `favicon-64x64.png` | 64x64 | Retina favicon | High-DPI displays |

---

## 🔄 Regenerating Assets

If you update the original `logo.png` or `logo.svg`, regenerate all sizes:

```bash
cd assets/

# Favicons
convert logo.png -resize 32x32 favicon-32x32.png
convert logo.png -resize 64x64 favicon-64x64.png
convert favicon-32x32.png favicon.ico

# App icon
convert logo.png -resize 512x512 logo-512x512.png

# Social preview (1280x640, centered)
convert logo.png -resize 1280x640 -gravity center -extent 1280x640 -background white logo-social.png
```

---

## 🎨 Color Specifications

Your logo uses:
- **Primary Black:** `#000000`
- **Primary White:** `#FFFFFF`
- **Glass Effect:** `rgba(255, 255, 255, 0.1)`
- **Background:** Transparent or white

---

## 📐 Design Guidelines

**When using the logo:**
- ✅ Maintain aspect ratio (don't stretch)
- ✅ Use on white or light backgrounds
- ✅ Minimum size: 32x32px (still recognizable)
- ✅ Clear space: 20px padding around logo
- ❌ Don't add drop shadows
- ❌ Don't change colors
- ❌ Don't rotate or skew

---

## 🚀 Quick Setup Commands

### Copy favicon to playground:
```bash
cp assets/favicon.ico apps/playground/public/
cp assets/favicon-32x32.png apps/playground/public/
cp assets/favicon-64x64.png apps/playground/public/
```

### Copy to docs folder:
```bash
cp assets/logo.svg docs/
cp assets/logo-social.png docs/
```

---

## 📦 Optimization

All assets are already optimized! But if you need smaller sizes:

```bash
# Optimize PNG (requires pngquant)
pngquant --quality=65-80 logo.png -o logo-optimized.png

# Optimize SVG (requires svgo)
svgo logo.svg -o logo-optimized.svg
```

---

## ✅ Checklist

- [x] Logo created (SVG + PNG)
- [x] Favicons generated (32x32, 64x64, .ico)
- [x] App icon created (512x512)
- [x] Social preview created (1280x640)
- [ ] Added to README.md
- [ ] Uploaded to GitHub social preview
- [ ] Added to playground HTML
- [ ] Added to package.json

---

All set! 🎉

