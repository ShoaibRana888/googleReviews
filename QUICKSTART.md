# Quick Start Guide - 5 Minutes to Launch

## Step 1: Install Dependencies (1 min)
```bash
npm install
```

## Step 2: Set Up Supabase (2 min)

1. Go to https://supabase.com → Sign up (free)
2. Create new project → Wait 2 minutes
3. Go to **SQL Editor** → New Query
4. Copy/paste entire `schema.sql` → Run
5. Go to **Project Settings** → **API**
6. Copy your URL and Anon Key

## Step 3: Configure Environment (1 min)

```bash
cp .env.example .env
```

Edit `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
JWT_SECRET=any-random-32-character-string-here-change-this
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Run the App (1 min)

```bash
npm run dev
```

Open http://localhost:3000

## Step 5: Test It Out

1. Sign up with email/password
2. Add a business (use any Google URL for testing)
3. Download the QR code
4. Open the rating page URL
5. Test both high (4-5) and low (1-3) ratings

## Get Your Real Google Review URL

1. Google "Google Business Profile"
2. Sign in → Select your business
3. Click "Get more reviews" 
4. Copy the URL (looks like `https://g.page/r/xxx/review`)

## Deploy to Production (Optional - 5 min)

1. Push code to GitHub
2. Go to vercel.com → Import repository
3. Add environment variables
4. Change `NEXT_PUBLIC_APP_URL` to your Vercel URL
5. Deploy!

---

**That's it! You now have a working review management system.**

## Common Issues

**Can't connect to database?**
- Double-check Supabase URL and key in `.env`
- Make sure you ran `schema.sql` in Supabase

**QR code shows "Business not found"?**
- Wait a few seconds after creating business
- Check database in Supabase dashboard

**Not redirecting to Google?**
- Make sure rating is 4 or 5 stars
- Check that Google URL is valid

Need help? Check the full README.md
