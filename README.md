# ReviewQR - QR Code Review Management System

A complete MVP application that helps small businesses get more Google reviews using QR codes. Customers scan the QR code, rate their experience, and are intelligently directed to either Google Reviews (for good ratings) or a private feedback form (for poor ratings).

## Features

✅ User signup/login with JWT authentication  
✅ Business profile management  
✅ QR code generation for each business  
✅ Customer rating page (1-5 stars)  
✅ Smart routing: 4-5 stars → Google Reviews, 1-3 stars → Private feedback  
✅ Feedback storage and dashboard  
✅ Analytics dashboard with stats  
✅ Mobile-responsive design  

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with httpOnly cookies
- **QR Codes**: qrcode npm package
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git (optional)

## Setup Instructions

### 1. Clone or Download the Project

If using Git:
```bash
git clone <your-repo-url>
cd review-qr-app
```

Or download and extract the zip file.

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be provisioned (2-3 minutes)
4. Go to **Project Settings** → **API**
5. Copy your:
   - Project URL (looks like `https://xxxxx.supabase.co`)
   - Anon/Public key (starts with `eyJ...`)

### 4. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `schema.sql` from this project
4. Paste it into the SQL editor
5. Click **Run** to execute

This will create all necessary tables with proper relationships and security policies.

### 5. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` and fill in your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
JWT_SECRET=your_random_secret_here_min_32_chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate a JWT secret:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use any random string generator
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### For Business Owners:

1. **Sign Up**: Create an account at `http://localhost:3000`
2. **Add Business**: Click "Add Business" and enter:
   - Business name
   - Your Google Review URL (get this from Google Business Profile)
3. **Download QR Code**: Your unique QR code will be generated automatically
4. **Display QR Code**: Print and display the QR code at your business location
5. **Monitor Dashboard**: View ratings, feedback, and analytics

### For Customers:

1. Scan the QR code with their phone
2. Rate their experience (1-5 stars)
3. **If 4-5 stars**: Redirected to Google Reviews to leave a public review
4. **If 1-3 stars**: Shown a private feedback form to share concerns

## Project Structure

```
review-qr-app/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Login/signup endpoints
│   │   ├── business/          # Business management
│   │   ├── feedback/          # Feedback storage
│   │   └── qr/                # QR code generation
│   ├── dashboard/             # Business owner dashboard
│   ├── r/[id]/                # Customer rating page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Login/signup page
├── lib/
│   ├── auth.ts                # Authentication utilities
│   └── supabase.ts            # Database client
├── schema.sql                 # Database schema
├── .env.example               # Environment template
└── README.md                  # This file
```

## Database Schema

### Users Table
- `id`: UUID (primary key)
- `email`: String (unique)
- `password_hash`: String
- `created_at`: Timestamp

### Businesses Table
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key → users)
- `business_name`: String
- `google_review_url`: String
- `qr_code_id`: String (unique)
- `created_at`: Timestamp

### Feedback Table
- `id`: UUID (primary key)
- `business_id`: UUID (foreign key → businesses)
- `rating`: Integer (1-5)
- `feedback_text`: Text (nullable)
- `created_at`: Timestamp

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables in Vercel dashboard
6. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
7. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL` (your production URL)

## Getting Your Google Review URL

1. Go to your [Google Business Profile](https://business.google.com)
2. Select your business location
3. Click on "Get more reviews"
4. Copy the short URL (e.g., `https://g.page/r/xxx/review`)
5. Use this URL when creating your business in the app

## Customization Ideas

- Add email notifications for low ratings
- Integrate with more review platforms (Yelp, Facebook)
- Add analytics tracking (Google Analytics)
- Create custom QR code designs
- Add multi-language support
- Implement business categories and tags

## Troubleshooting

### "User already exists" error
- The email is already registered. Try logging in instead.

### QR code not working
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly
- Check that the business exists in your database
- Verify the QR code links to `/r/{qr_code_id}`

### Database connection errors
- Verify Supabase credentials in `.env`
- Check that database tables were created successfully
- Ensure RLS policies are enabled

### Rating page not loading
- Check browser console for errors
- Verify the business exists with that QR code ID
- Ensure the API route `/api/business/[id]` is working

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase logs in the dashboard
3. Check browser console for errors
4. Verify all environment variables are set

## License

MIT License - feel free to use this for your business or modify as needed!

## Next Steps

1. ✅ Set up the app following the instructions above
2. ✅ Create your first business and QR code
3. ✅ Test the customer flow
4. 📊 Gather real feedback
5. 🚀 Deploy to production
6. 📈 Scale your review collection!

---

Built with Next.js, Supabase, and ❤️
