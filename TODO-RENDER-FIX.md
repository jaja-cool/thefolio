# Render Full-Stack Deploy Fix - Full Stack on Backend ✅ Approved Plan

## Current Progress

- [x] Plan created & approved
- [ ] ⚠️ 1. Build frontend & copy (FAILED - investigate deps/CRA version; Render will auto-build)

- [x] 2. Update backend/package.json scripts ✅

- [x] 3. Update backend/server.js (SPA fallback) ✅

- [ ] 4. Local test (run above command, test localhost:5000)

- [ ] 5. Commit & push to trigger Render deploy
- [x] 6. Seed data & final test (run: cd backend && npm run seed && node seedPosts.js) ✅

**Next step: Build frontend now.**

## Detailed Steps Breakdown

**Step 1: Build Frontend**

```
cd frontend
npm install
npm run build
cd ..
xcopy frontend\build\* backend\public\ /E /I /Y
```

Expected: `backend/public/` now has `index.html`, `static/`, etc.

**Step 2: Update backend/package.json**
Add scripts for Render automation:

```
\"build:frontend\": \"cd ..\/frontend && npm ci && npm run build && cd ..\/backend && xcopy ..\\frontend\\build\\* public\\ \/E \/I \/Y\",
\"build\": \"npm run build:frontend\"
```

**Step 3: Update backend/server.js**
Add after API routes (before app.listen):

```js
// SPA fallback for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
```

**Step 4: Local Test**

```
cd backend
npm run dev
```

Visit http://localhost:5000 → should load SplashPage (React app).

**Step 5: Deploy**

```
git add .
git commit -m \"fix(render): add frontend build + SPA serve\"
git push
```

Render auto-deploys using new `build` script.

**Step 6: Seed & Verify**

```
cd backend
node seedPosts.js
```

Test https://thefolio-5poz.onrender.com → works!
