# 🚀 Production Deployment Guide

## 📧 Real Email Setup (Gmail SMTP)

### Step 1: Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Security → 2-Step Verification (enable if not already)
3. Search for "App passwords"
4. Select app: "Mail"
5. Select device: "Other" (e.g., "Email Scheduler")
6. Copy the 16-character password

### Step 2: Update Backend .env

```env
# Real Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password

# Or use SendGrid (recommended for production)
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASS=your-sendgrid-api-key
```

### Step 3: Update mailService.ts

Replace the file `backend/src/services/mailService.ts`:

```typescript
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const createTransporter = async () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!,
        },
    });
};
```

---

## 🔐 Real User Authentication

### Option A: Keep Current System (Quick)
- Current login works - just redirects
- No database changes needed
- Good for demo/testing

### Option B: Full Authentication (Production Ready)

I'll set this up for you with:
- User registration
- Email/password login
- JWT tokens
- Password hashing with bcrypt

---

## 🗄️ Database Options

### Current: PostgreSQL
✅ Already working
✅ Great for production
✅ Free tier: Railway, Render, Supabase

### Switch to MongoDB (If you prefer)

**Pros:**
- Flexible schema
- Easy to deploy
- Free tier: MongoDB Atlas

**Cons:**
- Need to migrate data
- Prisma setup changes

**Your MongoDB URL format:**
```
mongodb+srv://username:password@cluster.mongodb.net/dbname
```

---

## 🌐 Deployment Platforms

### Frontend (Next.js) - **Vercel** (Free)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Add environment variables
5. Deploy

### Backend (Express) - **Railway** (Free $5/month credit)
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Add PostgreSQL service
4. Add Redis service
5. Add environment variables
6. Deploy

### OR: **Render** (Free tier available)
Similar process to Railway

---

## 🎯 Quick Deploy checklist

1. [ ] Replace Ethereal with real SMTP
2. [ ] Add user authentication
3. [ ] Deploy backend to Railway
4. [ ] Deploy frontend to Vercel
5. [ ] Update CORS settings
6. [ ] Test email sending
7. [ ] Update domain in Google OAuth

---

## Demo Credentials

For testing, create these users:

**User 1:**
- Email: demo@example.com
- Password: Demo123!@#

**User 2:**
- Email: test@example.com
- Password: Test123!@#

---

Would you like me to implement:
1. Real user authentication with signup/login?
2. Switch to MongoDB?
3. Update for Gmail/SendGrid SMTP?
4. Create deployment scripts?

Let me know and I'll set it up!