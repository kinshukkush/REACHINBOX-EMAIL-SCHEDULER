# 🚀 Quick Setup Checklist

Use this checklist to ensure everything is set up correctly before running the application.

## ✅ Prerequisites Check

- [ ] Node.js v18+ installed (`node --version`)
- [ ] PostgreSQL 16 installed and running
- [ ] Redis installed and running
- [ ] Git installed

## ✅ Installation Steps

### Backend Setup
- [ ] Navigate to `backend/` folder
- [ ] Run `npm install`
- [ ] Create `.env` file with all required variables (see README.md)
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Verify database `email_scheduler` was created

### Frontend Setup
- [ ] Navigate to `frontend/` folder  
- [ ] Run `npm install`
- [ ] Create `.env.local` file with all required variables (see README.md)

## ✅ Services Running

- [ ] PostgreSQL service is running (port 5432)
  ```powershell
  Get-Service postgresql-x64-16
  ```
  
- [ ] Redis is running (port 6379)
  ```powershell
  Test-NetConnection -ComputerName localhost -Port 6379
  ```

## ✅ Start Application

- [ ] Start backend: `cd backend && npm run dev`
  - Should see: "Server running on http://localhost:4000"
  - Should see worker messages about Redis version
  
- [ ] Start frontend: `cd frontend && npm run dev`
  - Should see: "Local: http://localhost:3000"
  - Should see: "Ready in X.Xs"

## ✅ Verify Application Works

- [ ] Open http://localhost:3000 in browser
- [ ] Login page loads correctly
- [ ] Click "Login with Google" → redirects to dashboard
- [ ] Dashboard shows "Scheduled" and "Sent" tabs
- [ ] Click "Compose" button → composition page opens
- [ ] All form fields are visible (From, To, Subject, Start Time, etc.)

## ✅ Test Email Scheduling

- [ ] Prepare CSV file with emails (use `sample-emails.csv`)
- [ ] In Compose page:
  - [ ] Upload CSV file
  - [ ] See email count (e.g., "10 recipients detected")
  - [ ] Fill in Subject
  - [ ] Fill in Body text
  - [ ] Set Start Time (2 minutes from now)
  - [ ] Keep Delay: 2000ms
  - [ ] Keep Hourly Limit: 200
  - [ ] Click "Schedule Emails"
  - [ ] See success message
  - [ ] Redirected to dashboard

- [ ] In Dashboard:
  - [ ] See scheduled emails in "Scheduled" tab
  - [ ] Wait for scheduled time to pass
  - [ ] Refresh page
  - [ ] Emails moved to "Sent" tab

## ✅ Verify Email Delivery

- [ ] Open https://ethereal.email/messages
- [ ] Login with your Ethereal credentials (from .env file)
- [ ] See sent emails in inbox
- [ ] Open an email to verify content

## ✅ Test Persistence (Server Restart)

- [ ] Schedule emails for 2-3 minutes from now
- [ ] Note the scheduled time
- [ ] Stop backend server (Ctrl+C)
- [ ] Wait 10 seconds
- [ ] Start backend again (`npm run dev`)
- [ ] Worker should show "connected" messages
- [ ] Wait for scheduled time
- [ ] Check "Sent" tab → emails should be sent
- [ ] ✅ Persistence verified!

## ✅ Code Quality Check

- [ ] TypeScript compilation has no errors
- [ ] No console errors in browser
- [ ] Backend terminal shows no errors
- [ ] All API endpoints returning correct data
- [ ] Environment variables are correct

## ✅ GitHub Repository

- [ ] Create private GitHub repository
- [ ] Initialize git: `git init`
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "Initial commit - ReachInbox Email Scheduler"`
- [ ] Add remote: `git remote add origin <your-repo-url>`
- [ ] Push: `git push -u origin main`
- [ ] Grant access to user: `Mitrajit`
- [ ] Verify README.md is visible

## ✅ Documentation

- [ ] README.md is complete and accurate
- [ ] EXPLANATION.md is present for video recording
- [ ] All environment variables documented
- [ ] Sample CSV file included
- [ ] Architecture explanation is clear

## ✅ Video Recording Preparation

- [ ] Backend is running
- [ ] Frontend is running
- [ ] Both services responding correctly
- [ ] Test CSV file ready
- [ ] Ethereal email login works
- [ ] Can demonstrate server restart
- [ ] Screen recording software ready
- [ ] Microphone tested

## ✅ Final Submission

- [ ] Video recorded (max 5 minutes)
- [ ] Video uploaded to YouTube/Google Drive
- [ ] Video set to "Unlisted" or public link available
- [ ] GitHub repository link ready
- [ ] Fill form: https://forms.gle/PstJgufbi5Qn3y5X9
  - [ ] Name
  - [ ] Email
  - [ ] GitHub repository URL
  - [ ] Video demo URL
  - [ ] Any additional notes
- [ ] Submit form
- [ ] ✅ Assignment submitted!

---

## 🆘 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Check Redis is running
- Verify `.env` file exists and has correct values
- Check database password is correct
- Try: `npx prisma generate` again

### Frontend won't start
- Check `.env.local` file exists
- Verify NEXT_PUBLIC_API_URL is correct
- Clear `.next` folder: `rm -r -force .next`
- Reinstall: `rm -r -force node_modules && npm install`

### Emails not scheduling
- Check backend console for errors
- Verify API_URL in frontend .env.local
- Check network tab in browser DevTools
- Verify backend is running on port 4000

### Emails not sending
- Check BullMQ worker is running (see backend logs)
- Check Redis is accessible
- Verify Ethereal SMTP credentials in .env
- Check scheduled time is in the future

### Can't see sent emails
- Check "Sent" tab in dashboard
- Refresh the page
- Check backend logs for send errors
- Verify status in database changed to SENT

---

**Good luck! 🎉**