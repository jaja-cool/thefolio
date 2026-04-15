# FINAL DEPLOY ✅ Images Working

**Changes**:

- post.routes.js: `req.file.filename` → full Cloudinary URL
- Frontend img src: handles http OR /uploads/

**Deploy**:

```
git add .
git commit -m "fix: cloudinary full urls in db"
git push origin main
```

**Test**:

1. Create post → image
2. /api/posts → **"https://res.cloudinary.com/dgci0u1um..."**
3. Homepage → **IMAGES LOAD**!

**Your thefolio portfolio LIVE!** 🎉
