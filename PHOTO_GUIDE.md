# 📸 Free Photo Storage Guide

## Option 1: Local Storage (Immediate)
1. Copy your photos to `public/images/` folder
2. Rename them as: photo1.jpg, photo2.jpg, photo3.jpg, photo4.jpg
3. They'll work immediately in your app!

## Option 2: GitHub as Free Cloud Storage (Recommended)

### Step 1: Add Photos to Your Project
```bash
# Copy your photos to public/images/ folder
# Make sure they're named: photo1.jpg, photo2.jpg, etc.
```

### Step 2: Push to GitHub
```bash
git add public/images/
git commit -m "Add travel photos"
git push origin main
```

### Step 3: Get GitHub Raw URLs (For Cloud Access)
1. Go to your GitHub repo
2. Navigate to `public/images/photo1.jpg`
3. Click "Raw" button
4. Copy the URL (format: `https://raw.githubusercontent.com/YOUR_USERNAME/REPO_NAME/main/public/images/photo1.jpg`)
5. Update `src/data.js` with these URLs

### Example:
```javascript
{
    id: 1,
    img: {
        src: "https://raw.githubusercontent.com/yourusername/TRavel-Journal/main/public/images/photo1.jpg",
        alt: "Your photo"
    },
    ...
}
```

## Option 3: Other Free Services

### ImgBB (Free & Easy)
- Go to https://imgbb.com/
- Upload images (no account needed)
- Copy direct link
- Use in your data.js

### Cloudinary (Free Tier)
- Sign up at https://cloudinary.com/
- Free: 25GB storage, 25GB bandwidth/month
- Upload photos via dashboard
- Copy image URLs

### GitHub Pages Hosting (Free)
- Deploy your entire project to GitHub Pages (free)
- Your photos will be hosted online automatically
- Tutorial: https://vitejs.dev/guide/static-deploy.html#github-pages

## Current Setup
✅ Created `public/images/` folder
✅ Updated data.js to use local paths
✅ Ready for your photos!

## Quick Start
1. Copy 4 photos into `public/images/` folder
2. Rename them: photo1.jpg, photo2.jpg, photo3.jpg, photo4.jpg
3. Refresh your app - they'll appear instantly!

## Tips
- Use .jpg format for smaller file sizes
- Recommended size: 1200px width for best quality
- Compress images before uploading: https://tinypng.com/
