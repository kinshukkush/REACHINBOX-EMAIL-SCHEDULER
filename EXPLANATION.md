# 🎥 Project Explanation Guide for Video Recording

This document provides a structured guide for explaining your ReachInbox Email Scheduler project in your demo video.

---

## 📹 Video Structure (5 Minutes Max)

### 1. Introduction (30 seconds)
**What to say:**
- "Hi, this is my submission for the ReachInbox Full-stack Email Scheduler assignment"
- "I've built a production-grade email scheduling system using BullMQ, Redis, PostgreSQL, Express, and Next.js"
- "The system can schedule thousands of emails, handle rate limiting, and survive server restarts"

### 2. Tech Stack Overview (30 seconds)
**What to show:** Show `README.md` tech stack section

**What to say:**
- "Backend: TypeScript, Express.js, BullMQ for job queuing, PostgreSQL with Prisma 7, and Redis for job storage"
- "Frontend: Next.js 16 with App Router, Tailwind CSS, NextAuth for authentication"
- "All scheduling is done via BullMQ delayed jobs - NO cron jobs as per requirements"

### 3. Live Demo - Scheduling Emails (1.5 minutes)
**What to show:**

1. **Login Page** (http://localhost:3000)
   - "Here's the login page with a clickable Google OAuth button"
   - Click the button, get redirected to dashboard

2. **Dashboard - Scheduled Emails**
   - "This is the dashboard showing all scheduled emails that haven't been sent yet"
   - Point out the scheduled time badges

3. **Compose Email**
   - Click "Compose" button
   - "Now I'll schedule some emails"
   - Upload CSV file: "I can upload a CSV file with email addresses"
   - Show email count: "The system automatically parses and detects X email addresses"
   - Fill subject: "Meeting Follow-up"
   - Fill body: "Hi, this is a scheduled email from my system"
   - Set start time: "I'm setting this to send 2 minutes from now"
   - Show delay: "2000ms delay between each email"
   - Show hourly limit: "200 emails per hour limit"
   - Click "Schedule Emails"
   - "Emails are now scheduled and stored in the database"

4. **Check Scheduled Tab**
   - Go back to dashboard
   - "Here are our newly scheduled emails with their scheduled times"

### 4. Architecture Explanation (1.5 minutes)
**What to show:** Open `EXPLANATION.md` or VS Code

**What to say:**

**Scheduling Flow:**
- "When a user schedules emails, here's what happens:"
- "1. API receives the request and creates email records in PostgreSQL"
- "2. For each email, we calculate the delay: scheduledTime minus current time"
- "3. Jobs are added to BullMQ with this delay"
- "4. BullMQ stores these jobs in Redis - this makes them persistent"
- "5. When the delay expires, the worker picks up the job"

**File Structure:**
Show these key files in VS Code:

```
backend/src/
├── controllers/emailController.ts  ← "Handles API requests"
├── queues/emailQueue.ts            ← "BullMQ queue setup"
└── workers/emailWorker.ts          ← "Where emails actually get sent"
```

**Rate Limiting:**
- Open `emailWorker.ts` and show the rate limiting code
- "Rate limiting uses Redis counters with a key like: rate-limit:senderId:2026-02-08-10"
- "We increment atomically and set 1-hour expiry"
- "If limit exceeded, job throws error and BullMQ retries with backoff"

**Persistence:**
- "All jobs are in Redis, so if the server restarts, jobs are not lost"
- "Let me demonstrate this..."

### 5. Persistence Demo (1 minute)
**What to show:**

1. Schedule emails for 2-3 minutes from now
2. Open backend terminal
3. "Now I'll stop the backend server" - Press Ctrl+C
4. Wait 5 seconds
5. "Now restarting the backend" - Run `npm run dev`
6. "The server restarted successfully"
7. "BullMQ automatically recovered all pending jobs from Redis"
8. Wait for scheduled time
9. "The emails are being sent even after the restart"
10. Go to Sent tab or refresh scheduled tab
11. "Here you can see the emails were sent successfully"

### 6. View Sent Emails (30 seconds)
**What to show:**

1. Dashboard → Sent tab
   - "Here are all the emails that were successfully sent"
   - Show the sent timestamp

2. Open Ethereal Email (https://ethereal.email/messages)
   - Login with: prince.senger76@ethereal.email
   - "And here's the actual email in the Ethereal inbox"
   - Open one email to show content

---

## 🗂 File Structure & Purpose

### Backend Files

#### `backend/src/index.ts`
**Purpose:** Express server entry point
- Sets up Express app with CORS
- Registers email routes
- Initializes BullMQ worker
- Starts server on port 4000

#### `backend/src/config/db.ts`
**Purpose:** Database connection
- Creates PrismaClient with PostgreSQL adapter
- Uses connection pool for efficiency
- Required for Prisma 7 architecture

#### `backend/src/config/redis.ts`
**Purpose:** Redis configuration
- Exports Redis connection options
- Used by both BullMQ queue and worker
- Configurable via environment variables

#### `backend/src/controllers/emailController.ts`
**Purpose:** API endpoint handlers
- `scheduleEmails()`: Creates emails in DB, adds jobs to BullMQ with calculated delay
- `getScheduledEmails()`: Returns all pending emails from database
- `getSentEmails()`: Returns all sent emails from database

**Key Logic:**
```typescript
// Calculate delay for BullMQ
const delay = Math.max(0, new Date(startTime).getTime() - Date.now());

// Add to queue with delay
await emailQueue.add('send-email', {
  emailId, senderId, hourlyLimit, delayBetweenEmails
}, { delay });
```

#### `backend/src/queues/emailQueue.ts`
**Purpose:** BullMQ queue setup
- Creates queue connected to Redis
- Sets default job options (retry 3 times, exponential backoff)
- Exports queue for adding jobs

#### `backend/src/workers/emailWorker.ts`
**Purpose:** Job processing with rate limiting
**Key Features:**
1. **Rate Limiting**:
   ```typescript
   const currentHour = new Date().toISOString().substring(0, 13);
   const rateLimitKey = `rate-limit:${senderId}:${currentHour}`;
   const count = await redis.incr(rateLimitKey);
   ```
   
2. **Delay Between Emails**:
   ```typescript
   await new Promise(resolve => setTimeout(resolve, delayBetweenEmails));
   ```

3. **Email Sending**:
   - Fetches email from database
   - Checks if already sent (idempotency)
   - Sends via Nodemailer
   - Updates status to SENT

4. **Concurrency**: Worker runs with `concurrency: 5`

#### `backend/src/services/mailService.ts`
**Purpose:** SMTP configuration
- Creates Nodemailer transporter
- Uses Ethereal Email credentials
- Returns configured transporter for sending

#### `backend/prisma/schema.prisma`
**Purpose:** Database schema
- `Sender` model: Email senders with unique email
- `Email` model: Individual email records with status
- `EmailStatus` enum: PENDING, SENT, FAILED

---

### Frontend Files

#### `frontend/src/app/page.tsx`
**Purpose:** Root page that redirects to `/login`

#### `frontend/src/app/login/page.tsx`
**Purpose:** Login page
- Google OAuth button (clickable)
- Email/password form (also works)
- Redirects to dashboard on login
- Uses `"use client"` for client-side navigation

#### `frontend/src/app/dashboard/layout.tsx`
**Purpose:** Dashboard shell
- Wraps all dashboard pages
- Includes Sidebar and Header components
- Provides consistent layout

#### `frontend/src/app/dashboard/page.tsx`
**Purpose:** Scheduled emails view
**Key Features:**
- Fetches from `/api/emails/scheduled`
- Shows loading state
- Shows empty state
- Displays scheduled time badge
- Real-time data from backend

#### `frontend/src/app/dashboard/sent/page.tsx`
**Purpose:** Sent emails view
**Key Features:**
- Fetches from `/api/emails/sent`
- Shows sent timestamp
- Green badge with checkmark
- Empty state handling

#### `frontend/src/app/dashboard/compose/page.tsx`
**Purpose:** Email composition form
**Key Features:**
1. **CSV Upload**: Parses emails from uploaded file
2. **Form Fields**:
   - From (sender dropdown)
   - To (manual or CSV)
   - Subject
   - Start Time (datetime picker)
   - Delay Between Emails (milliseconds)
   - Hourly Limit
   - Body (textarea)
3. **Submission**: Posts to `/api/emails/schedule`
4. **Success State**: Shows checkmark and redirects

#### `frontend/src/components/Sidebar.tsx`
**Purpose:** Navigation sidebar
- Logo and branding
- User profile section
- Compose button (highlighted)
- Navigation items: Scheduled, Sent
- Active state highlighting

#### `frontend/src/components/Header.tsx`
**Purpose:** Top header
- Search bar (cosmetic)
- Filter and refresh buttons
- Consistent across all pages

#### `frontend/src/app/api/auth/[...nextauth]/route.ts`
**Purpose:** NextAuth configuration
- Google OAuth provider setup
- Session handling
- Callback URLs

---

## 🎯 Key Points to Emphasize in Video

### 1. No Cron Jobs ✅
- "Notice I'm not using any cron libraries"
- "All scheduling is done through BullMQ's delayed job feature"
- "This is more reliable and scalable"

### 2. Persistence ✅
- "When I restart the server, jobs don't disappear"
- "They're safely stored in Redis"
- "BullMQ automatically recovers them on restart"

### 3. Rate Limiting ✅
- "The system enforces 200 emails per hour per sender"
- "This uses Redis atomic counters"
- "It's safe even with multiple workers running"

### 4. Idempotency ✅
- "Each email can only be sent once"
- "The worker checks the database status before sending"
- "Even if a job retries, the email won't be duplicated"

### 5. Scalability ✅
- "The system can handle 1000+ emails scheduled at once"
- "Worker concurrency means 5 emails send in parallel"
- "Rate limiting ensures we don't exceed provider limits"

### 6. Clean Architecture ✅
- "Backend is well-structured: controllers, services, workers"
- "Frontend uses reusable components"
- "TypeScript throughout for type safety"

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   User UI   │ Schedule Email
│  (Next.js)  │────────────────┐
└─────────────┘                │
                               ▼
                    ┌──────────────────┐
                    │  Backend API     │
                    │  (Express)       │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │                  │
                    ▼                  ▼
           ┌────────────────┐  ┌──────────────┐
           │   PostgreSQL   │  │   BullMQ     │
           │   (Prisma)     │  │   Queue      │
           └────────────────┘  └──────┬───────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │    Redis     │
                               │  (Storage)   │
                               └──────┬───────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │  BullMQ      │
                               │  Worker      │
                               └──────┬───────┘
                                      │
                    ┌─────────────────┼─────────────┐
                    │                 │             │
                    ▼                 ▼             ▼
           ┌────────────────┐  ┌──────────┐  ┌─────────┐
           │ Rate Limiting  │  │   Send   │  │ Update  │
           │ (Redis Check)  │  │   SMTP   │  │   DB    │
           └────────────────┘  └──────────┘  └─────────┘
```

---

## 🎬 Video Recording Tips

### Do's ✅
- Start with a clear introduction
- Speak clearly and at moderate pace
- Show the actual application running
- Demonstrate the restart scenario
- Highlight key code sections briefly
- End with a summary of features

### Don'ts ❌
- Don't spend too long on setup/installation
- Don't read the README word-for-word
- Don't go too deep into every file
- Don't exceed 5 minutes
- Don't forget to show the final result (sent emails)

### Recording Order
1. Record the demo first (application running)
2. Record code walkthrough next
3. Record introduction and conclusion
4. Edit together with transitions
5. Add text overlays for key points (optional)

---

## 📝 Script Template

"Hi, I'm [Your Name], and this is my ReachInbox Email Scheduler assignment submission.

I've built a production-grade email scheduling system using modern technologies. The backend uses Express, BullMQ for job queuing, PostgreSQL for data storage, and Redis for job persistence. The frontend is built with Next.js 16 and Tailwind CSS.

Let me show you how it works. [START DEMO]

[After demo] As you can see, the system successfully schedules emails, enforces rate limits, and persists jobs across server restarts - all without using cron jobs.

The architecture is clean and scalable. [Show code structure briefly]

Thank you for watching. All code is available in the GitHub repository with comprehensive documentation."

---

## 🔗 Submission Checklist

Before recording:
- [ ] Backend running on localhost:4000
- [ ] Frontend running on localhost:3000
- [ ] Redis running
- [ ] PostgreSQL running
- [ ] Test scheduling works
- [ ] Test restart scenario
- [ ] Prepare CSV file with test emails
- [ ] Check Ethereal inbox login works
- [ ] README.md is complete
- [ ] .env files are properly configured
- [ ] Code is committed to GitHub
- [ ] Repository is private
- [ ] Mitrajit has access to repo

During recording:
- [ ] Show login page
- [ ] Show dashboard
- [ ] Schedule emails with CSV upload
- [ ] Show scheduled emails
- [ ] Demonstrate server restart
- [ ] Show sent emails
- [ ] Open Ethereal inbox
- [ ] Briefly explain architecture
- [ ] Show key code files

After recording:
- [ ] Upload video to YouTube/Google Drive
- [ ] Make video accessible via link
- [ ] Fill submission form: https://forms.gle/PstJgufbi5Qn3y5X9
- [ ] Include GitHub repo link
- [ ] Include video link
- [ ] Double-check all requirements met

---

Good luck with your video recording! 🎬🚀