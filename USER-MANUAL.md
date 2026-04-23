# Abhishek Goswami Music — User Manual

## What This Site Offers

### For Visitors (Public)
- **Home** — Landing page with artist intro, free lesson previews, and featured courses
- **Free Lessons** — YouTube videos accessible without login or payment
- **Courses** — Browse premium course catalog with descriptions, curriculum outlines, and pricing
- **Contact** — Send a message directly to the admin
- **Day/Night Theme** — Toggle between dark (smoky jazz) and light (clean white) modes

### For Registered Users
- **Sign Up / Login** — Email + password or Google OAuth
- **Buy Courses** — Purchase via Razorpay (UPI, cards, netbanking)
- **My Courses (Dashboard)** — View all purchased courses in one place
- **Course Player** — Watch sequential video lessons with a sidebar playlist

### For Admin (Musician)
- **Admin Panel** (`/admin`) — Manage the entire site
- **Dashboard** — See total courses, students, revenue, and unread messages at a glance
- **Courses CRUD** — Create, edit, publish/unpublish, and delete courses
- **Video Management** — Add YouTube unlisted URLs per course, set preview videos, reorder lessons
- **Free Videos** — Add/remove public YouTube videos, toggle visibility
- **Payments** — View all transactions (student, course, amount, status, Razorpay payment ID)
- **Messages** — Read, mark as read/unread, and delete contact form submissions

---

## How Content Protection Works

### The Problem
Premium course videos are YouTube unlisted links. Anyone with the link can watch them. So how do we prevent non-paying users from accessing them?

### The Solution: 3-Layer Protection

**Layer 1 — Route Middleware**
When someone tries to visit `/courses/guitar-basics/watch`, the middleware runs first. If the user is not logged in, they are immediately redirected to the login page. They never reach the course player.

**Layer 2 — Server-Side Purchase Verification**
Even if a user is logged in, the course player page (a Server Component) checks the database for a completed purchase record matching this user + this course. If no valid purchase exists, they are redirected to the course detail page (where they see the "Buy Now" button). The YouTube URLs are only fetched from the database and rendered into the page HTML if the purchase check passes.

**Layer 3 — Supabase Row Level Security (RLS)**
At the database level itself, the `course_videos` table has RLS policies that only return `youtube_url` values to users who have a completed purchase for that course. Even if someone bypasses the application layer, the database refuses to return the sensitive data.

### What Razorpay Does

Razorpay handles the actual money transaction:

1. User clicks **"Buy Now"** → the server creates a Razorpay order
2. Razorpay checkout modal opens → user pays via UPI / card / netbanking
3. After payment, Razorpay sends back a **payment ID + cryptographic signature**
4. The server **verifies the signature** using HMAC-SHA256 with your secret key
5. Only if the signature is valid → the purchase is marked as "completed" in the database
6. The user can now access the course videos

**Key security point:** The signature verification (step 4) ensures that no one can fake a payment. Only Razorpay can produce a valid signature, and only your server has the secret key to verify it. A purchase record is only marked "completed" after this cryptographic check passes.

### What Users See

| User State | Course Detail Page | Course Player |
|---|---|---|
| Not logged in | Sees curriculum (titles only, lock icons), "Login to Buy" button | Redirected to login |
| Logged in, not purchased | Sees curriculum (lock icons), "Buy Now" button with price | Redirected to course detail |
| Logged in, purchased | Sees curriculum (play icons), "Continue Watching" button | Full video player with all lessons |

### Limitations (MVP Trade-offs)

- YouTube unlisted URLs appear in the page HTML source for users who have purchased. A technically savvy user could extract and share them. This is acceptable for MVP because:
  - The URLs are only rendered for verified purchasers
  - YouTube unlisted is "security through obscurity" by design
  - For stronger protection in the future, consider Vimeo's domain-restricted embeds or a custom video player with token-based access

---

## How to Upload a Paid Course (Step-by-Step Workflow)

The site does not host any video files. All videos live on YouTube as **unlisted** uploads. You simply paste the YouTube URLs into the admin panel. Here's the full workflow:

### Step 1: Record & Upload to YouTube

1. Record your course lessons (e.g., "Lesson 1 — Jazz Chord Voicings", "Lesson 2 — Walking Bass Lines")
2. Upload each lesson to your YouTube channel
3. **Set each video to "Unlisted"** — this is critical
   - Go to YouTube Studio → Content → click the video → Visibility → **Unlisted**
   - Unlisted means: anyone with the direct link can watch, but it won't appear in search, on your channel page, or in recommendations
   - Only people who buy the course on your site will ever get these links
4. Copy the URL of each uploaded video (e.g., `https://www.youtube.com/watch?v=abc123`)

### Step 2: Create the Course in Admin Panel

1. Log in to your site and go to `/admin`
2. Click **Courses** in the sidebar → **New Course**
3. Fill in:
   - **Title** — e.g., "Jazz Chord Melody Masterclass"
   - **Slug** — auto-generates from title, or type your own (e.g., `jazz-chord-melody`)
   - **Description** — what students will learn, who it's for, etc.
   - **Price** — in Rupees (e.g., `999` for ₹999)
   - **Thumbnail URL** — optional, paste a link to a course cover image
   - **Published** — leave unchecked while you're still adding videos
4. Click **Create Course**

### Step 3: Add Videos to the Course

1. From the Courses list, click the **video icon** next to your course
2. Click **Add Video** and fill in:
   - **Title** — e.g., "Lesson 1 — Major 7th Voicings"
   - **YouTube URL** — paste the unlisted URL you copied from YouTube
   - **Duration** — optional, in minutes
   - **Free Preview** — check this box if you want this lesson to be visible (title only) to non-paying visitors as a teaser. The actual video will NOT play for them — they only see that it exists
3. Repeat for all lessons. Videos are numbered in the order you add them
4. The first few videos of a course should ideally be marked as "Preview" to give potential buyers a sense of the curriculum

### Step 4: Publish the Course

1. Go back to **Courses** → click the **edit icon** next to your course
2. Check the **Published** checkbox
3. Click **Update Course**
4. The course now appears on the public site with the "Buy Now" button

### Step 5: What Happens When a Student Buys

```
Student visits /courses/jazz-chord-melody
    ↓
Sees course description, curriculum (titles + lock icons), price
    ↓
Clicks "Buy Now — ₹999"
    ↓
Razorpay checkout modal opens (UPI / Card / Netbanking)
    ↓
Student pays → Razorpay verifies → purchase marked "completed"
    ↓
Student redirected to /courses/jazz-chord-melody/watch
    ↓
Sees all lesson videos (YouTube unlisted embeds) in a player with sidebar
    ↓
Can rewatch anytime — lifetime access
```

### Step 6: Monitor Payments

- Go to `/admin` → **Payments** to see all transactions
- Each row shows: date, student name/email, course, amount, status, and Razorpay payment ID
- You can cross-reference with your Razorpay dashboard for refunds or disputes

### Quick Reference: YouTube Upload Settings

| Setting | Value | Why |
|---|---|---|
| Visibility | **Unlisted** | Only accessible via direct link — your site controls who gets the link |
| Comments | Off (recommended) | Prevents the URL from being discovered via comment notifications |
| Embedding | Allowed | Required for the site's video player to work |
| Age restriction | None | Unless content requires it |
| Playlist | Don't add to any public playlist | Public playlists expose unlisted video URLs |

### Adding More Lessons Later

You can add new videos to an existing published course at any time:
1. Upload the new lesson to YouTube (unlisted)
2. Go to Admin → Courses → video icon → Add Video
3. Students who already purchased will see the new lesson immediately

### Updating or Replacing a Video

If you need to re-record a lesson:
1. Upload the new version to YouTube (unlisted)
2. Delete the old video entry in Admin → add a new one with the new URL
3. Optionally delete the old YouTube upload

---

## Setup Checklist

1. Create a **Supabase** project → copy URL + anon key + service role key
2. Run `supabase-migration.sql` in Supabase SQL Editor
3. Create a **Razorpay** account → copy test key ID + secret
4. Update `.env.local` with all credentials
5. Run `npm run dev` → open http://localhost:3000
6. Register an account → set as admin in Supabase SQL:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```
7. Go to `/admin` → start adding courses and videos
8. For production: deploy to Vercel, switch Razorpay to live mode
