# Deployment Checklist

## Pre-Deployment

- [ ] All features tested locally
- [ ] Database schema created in Supabase
- [ ] Environment variables configured
- [ ] Test user flows:
  - [ ] Sign up new account
  - [ ] Create business
  - [ ] Generate QR code
  - [ ] Test 5-star rating (should redirect to Google)
  - [ ] Test 3-star rating (should show feedback form)
  - [ ] View dashboard stats

## Vercel Deployment

### 1. Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Connect GitHub and select your repository
4. Click "Deploy"

### 3. Configure Environment Variables in Vercel

Go to Project Settings → Environment Variables and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

⚠️ **Important**: Use a NEW JWT_SECRET for production (not the same as development)

### 4. Update Supabase Settings

In Supabase dashboard:
1. Go to Authentication → URL Configuration
2. Add your Vercel URL to allowed redirect URLs
3. Add your Vercel domain to allowed domains

### 5. Test Production Deployment

- [ ] Can sign up new user
- [ ] Can create business
- [ ] QR code downloads properly
- [ ] Rating page loads via QR code
- [ ] High ratings redirect to Google
- [ ] Low ratings show feedback form
- [ ] Dashboard shows stats

## Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., reviewqr.com)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain
5. Redeploy

### SSL Certificate
- Vercel automatically provisions SSL certificates
- No action needed

## Post-Deployment

### Security Checklist
- [ ] JWT_SECRET is strong and unique
- [ ] Supabase RLS policies enabled
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced (automatic with Vercel)

### Performance Monitoring
- [ ] Enable Vercel Analytics
- [ ] Monitor Supabase usage
- [ ] Check for slow API routes

### Backup Strategy
- [ ] Supabase has automatic backups (check settings)
- [ ] Export database schema periodically
- [ ] Keep copy of environment variables secure

## Scaling Considerations

### When to Upgrade

**Supabase Free Tier Limits:**
- 500 MB database
- 2 GB file storage
- 50,000 monthly active users
- 2GB bandwidth

**Vercel Free Tier Limits:**
- 100 GB bandwidth
- Unlimited deployments
- Serverless function execution time limits

### If You Exceed Free Tiers:
- Upgrade Supabase to Pro ($25/month)
- Upgrade Vercel to Pro ($20/month)
- Consider caching strategies
- Optimize database queries

## Monitoring & Maintenance

### Weekly Checks
- [ ] Review error logs in Vercel
- [ ] Check Supabase database size
- [ ] Monitor response times
- [ ] Review user feedback

### Monthly Tasks
- [ ] Update dependencies
- [ ] Review security patches
- [ ] Backup database
- [ ] Check analytics

## Rollback Plan

If something goes wrong:

1. **Vercel**: Instant rollback to previous deployment
   - Go to Deployments → Select previous version → Promote to Production

2. **Database**: Restore from Supabase backup
   - Go to Database → Backups → Restore

3. **Emergency**: Pause deployments
   - Temporarily disable site in Vercel settings
   - Fix issues locally
   - Test thoroughly
   - Redeploy

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: Create in your repository

---

**Ready to Deploy?** Start with Step 1!

**After Deployment:**
- Share your app URL with your first customer
- Gather feedback
- Iterate and improve

Good luck! 🚀
