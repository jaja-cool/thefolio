# React Blog Fix - Like Count Persist Across Users

## Quick Restore & Test

**1. Restore published posts (if deleted)**

```
cd backend
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog').then(async () => {
  const Post = require('./models/Post');
  await Post.updateMany({}, {status: 'published'});
  const count = await Post.countDocuments({status: 'published'});
  console.log('Published posts restored:', count);
});
"
```

**2. Restart servers**

```
Terminal1: cd backend && npm start
Terminal2: cd frontend && npm start
```

**3. Test likes**

- `/home` → login User1 → like post → count ↑1
- Logout → login User2 → `/home` → count stays 1 ✓

Likes persist server-side in post.likes array.

**Changes made:**

- Frontend Homepage: refetch posts on user change
- Backend /posts: populate('likes') for UI state

Done!
