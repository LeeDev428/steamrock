# 🚀 Streamrock Realty - Development Workflow Guide

**Last Updated:** January 28, 2026  
**Project Owner:** LeeDev428  
**Repository:** https://github.com/LeeDev428/steamrock

---

## 📋 Table of Contents

1. [Branch Strategy](#branch-strategy)
2. [Project Owner Workflow](#project-owner-workflow)
3. [Co-Developer Workflow](#co-developer-workflow)
4. [Daily Workflow](#daily-workflow)
5. [Pull Request Process](#pull-request-process)
6. [Troubleshooting Guide](#troubleshooting-guide)
7. [Deployment Guide](#deployment-guide)
8. [Best Practices](#best-practices)

---

## 🌿 Branch Strategy

### Branch Structure

```
main (production)
  ├── Protected: Requires 1+ approval
  ├── Auto-deploy to production (AWS EC2/Vercel)
  └── Only merge from develop or hotfix branches

develop (staging/testing)
  ├── Protected: Requires 1 approval
  ├── Auto-deploy to staging environment
  └── Integration branch for all features

feature branches
  ├── feat/feature-name
  ├── design/design-name
  ├── fix/bug-name
  └── refactor/refactor-name
```

### Branch Naming Convention

| Type | Format | Example | Description |
|------|--------|---------|-------------|
| Feature | `feat/description` | `feat/booking-system` | New features |
| Design | `design/description` | `design/change-theme` | UI/UX changes |
| Bug Fix | `fix/description` | `fix/navbar-mobile` | Bug fixes |
| Hotfix | `hotfix/description` | `hotfix/critical-error` | Production bugs |
| Refactor | `refactor/description` | `refactor/api-structure` | Code improvements |
| Docs | `docs/description` | `docs/api-guide` | Documentation |
| Test | `test/description` | `test/booking-e2e` | Testing |

---

## 👨‍💼 Project Owner Workflow

### Initial Setup (One-Time)

#### 1. Create Develop Branch

```bash
cd d:\Programming\Systems\Web-Systems\MERN\steamrock

# Create develop branch from main
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

#### 2. Set Branch Protection Rules

**For `main` branch:**
- Go to: Settings → Branches → Add rule
- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require approvals: 1
- ✅ Require status checks to pass before merging
- ✅ Do not allow bypassing the above settings

**For `develop` branch:**
- Branch name pattern: `develop`
- ✅ Require a pull request before merging
- ✅ Require approvals: 1
- ✅ Do not allow bypassing the above settings

#### 3. Set Up Collaborators

- Go to: Settings → Collaborators
- Add co-developers with **Write** access
- They'll receive an invitation email

### Daily Workflow

#### Morning Routine (Before Starting Work)

```bash
# 1. Check for new Pull Requests on GitHub
# Visit: https://github.com/LeeDev428/steamrock/pulls

# 2. Update your local develop branch
git checkout develop
git pull origin develop

# 3. Check if your local branches need updating
git branch -vv  # See which branches are behind
```

#### Reviewing Pull Requests

**Step 1: Review on GitHub**

1. Go to Pull Requests tab
2. Click on the PR to review
3. Check the **Files changed** tab
4. Review each change carefully

**What to Check:**
- ✅ Code quality and style
- ✅ No console.logs or debug code
- ✅ Proper error handling
- ✅ Comments for complex logic
- ✅ No hardcoded values (use env variables)
- ✅ Responsive design (for UI changes)
- ✅ No breaking changes
- ✅ Tests pass (if applicable)

**Step 2: Test Locally (Important!)**

```bash
# 1. Fetch the feature branch
git fetch origin feat/booking-system

# 2. Create local branch to test
git checkout -b test-booking feat/booking-system

# 3. Install dependencies (if package.json changed)
cd backend
npm install
cd ../frontend
npm install

# 4. Test the feature
npm run dev  # Test thoroughly

# 5. If everything works, go back to GitHub
git checkout develop
git branch -D test-booking  # Delete test branch
```

**Step 3: Approve or Request Changes**

**If Everything is Good:**
```
1. On GitHub PR page, click "Review changes"
2. Select "Approve"
3. Add comment: "LGTM! Great work! ✅"
4. Click "Merge pull request"
5. Select merge type: "Squash and merge" (recommended)
6. Delete the feature branch after merge
```

**If Changes Needed:**
```
1. Click "Review changes"
2. Select "Request changes"
3. Add specific comments on code lines
4. Be clear and constructive:
   - ❌ Bad: "This is wrong"
   - ✅ Good: "Can you add error handling here? What if the API fails?"
5. Wait for co-dev to make changes
```

#### Merging Develop to Main (Production Release)

**When to Merge:**
- All features tested on develop
- No critical bugs
- Ready for production deployment

**Process:**

```bash
# 1. Make sure develop is up to date and tested
git checkout develop
git pull origin develop

# 2. Run final tests
cd backend
npm run dev  # Test backend
cd ../frontend
npm run dev  # Test frontend

# 3. Create PR from develop to main on GitHub
# Go to: https://github.com/LeeDev428/steamrock/compare/main...develop

# 4. Create Pull Request with detailed description:
```

**PR Template for Production Release:**
```markdown
## 🚀 Production Release - v1.X.X

### ✨ New Features
- [x] Booking system with calendar
- [x] Property filtering by price range
- [x] User authentication

### 🐛 Bug Fixes
- [x] Fixed mobile navbar responsiveness
- [x] Fixed property image loading

### 🎨 Design Changes
- [x] Updated color theme
- [x] Improved hero section

### ⚠️ Breaking Changes
- None

### 📝 Testing Checklist
- [x] All features tested on develop
- [x] Mobile responsive checked
- [x] Backend API working
- [x] MongoDB connection stable
- [x] Forms validated

### 🚀 Deployment Steps
1. Merge to main
2. SSH to AWS EC2
3. Pull latest code
4. Run npm install
5. Restart PM2
6. Monitor logs

### 📊 Performance
- Load time: < 3s
- No console errors
- All API endpoints working
```

```bash
# 5. After creating PR, review and merge
# 6. After merge, update your local main
git checkout main
git pull origin main

# 7. Tag the release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 8. Deploy to production (see Deployment Guide)
```

### Handling Hotfixes (Emergency Bugs in Production)

```bash
# 1. Create hotfix branch from main (NOT develop)
git checkout main
git pull origin main
git checkout -b hotfix/critical-payment-bug

# 2. Fix the bug quickly
# ... make changes ...

# 3. Commit and push
git add .
git commit -m "hotfix: resolve critical payment processing bug"
git push origin hotfix/critical-payment-bug

# 4. Create PR to main (urgent, can self-approve if necessary)
# 5. After merge to main, also merge to develop to keep it updated
git checkout develop
git pull origin develop
git merge main
git push origin develop

# 6. Deploy immediately
```

### Weekly Maintenance

```bash
# Every Monday morning:

# 1. Review all open PRs
# 2. Clean up merged branches
git fetch --prune

# 3. Check for outdated dependencies
cd backend
npm outdated
cd ../frontend
npm outdated

# 4. Review and close stale issues
# 5. Update project board/kanban
# 6. Sync with co-dev on priorities
```

---

## 👨‍💻 Co-Developer Workflow

### Initial Setup (One-Time)

#### 1. Clone Repository

```bash
# 1. Accept invitation from GitHub
# 2. Clone the repository
cd d:\Programming\Systems\Web-Systems\MERN
git clone https://github.com/LeeDev428/steamrock.git
cd streamrock

# 3. Install dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# 4. Set up environment variables
# Copy .env files from project owner or set up your own
```

#### 2. Configure Git

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Set develop as default branch for new features
git checkout develop
git pull origin develop
```

### Daily Workflow

#### Morning Routine

```bash
# ALWAYS do this before starting work:

# 1. Switch to develop and update
git checkout develop
git pull origin develop

# 2. Update your current feature branch (if you have one)
git checkout feat/your-feature  # Your current branch
git merge develop  # Merge latest develop into your branch
# OR
git rebase develop  # Rebase on develop (cleaner history)

# If conflicts occur, see Troubleshooting Guide
```

### Creating a New Feature

#### Step 1: Create Feature Branch

```bash
# ALWAYS branch from updated develop
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feat/booking-system

# Verify you're on the right branch
git branch  # Should show * feat/booking-system
```

#### Step 2: Work on Feature

```bash
# Make your changes
# Test locally frequently

# Commit regularly with descriptive messages
git add .
git commit -m "feat: add booking form component"

# More changes
git add .
git commit -m "feat: implement booking validation"

# Push to GitHub regularly (backup!)
git push origin feat/booking-system
```

#### Step 3: Keep Your Branch Updated

```bash
# Every day, sync with develop:
git checkout feat/booking-system
git fetch origin
git merge origin/develop

# If conflicts, resolve them (see Troubleshooting)
# Test after merging to ensure nothing broke
```

#### Step 4: Create Pull Request

**When Feature is Complete:**

```bash
# 1. Final commit
git add .
git commit -m "feat: complete booking system with tests"

# 2. Update with latest develop one more time
git fetch origin
git merge origin/develop

# 3. Test everything works
cd backend
npm run dev  # Test backend
cd ../frontend
npm run dev  # Test frontend

# 4. Push final version
git push origin feat/booking-system
```

**On GitHub:**

1. Go to: https://github.com/LeeDev428/streamrock/pulls
2. Click "New pull request"
3. Set:
   - **Base:** `develop` (NOT main!)
   - **Compare:** `feat/booking-system`
4. Click "Create pull request"

**PR Template to Use:**

```markdown
## 📝 Description
Brief description of what this PR does

## 🎯 Type of Change
- [ ] Bug fix
- [x] New feature
- [ ] Design change
- [ ] Refactoring
- [ ] Documentation

## ✨ What's Changed
- Added booking form component
- Implemented date picker
- Added booking validation
- Created booking API endpoint
- Updated database schema

## 🧪 Testing Done
- [x] Tested booking form submission
- [x] Tested date validation
- [x] Tested API endpoint with Postman
- [x] Tested on mobile devices
- [x] No console errors

## 📸 Screenshots (if UI change)
[Add screenshots]

## 📋 Checklist
- [x] Code follows project style
- [x] No console.logs left
- [x] Comments added for complex code
- [x] Tested thoroughly
- [x] No breaking changes
- [x] Updated with latest develop

## 🔗 Related Issues
Closes #123
```

5. Click "Create pull request"
6. Request review from @LeeDev428
7. **Wait for approval - DO NOT MERGE YOURSELF**

#### Step 5: Address Review Comments

```bash
# If project owner requests changes:

# 1. Make the requested changes
# ... edit files ...

# 2. Commit changes
git add .
git commit -m "fix: address PR review comments"

# 3. Push
git push origin feat/booking-system

# The PR will automatically update
# Wait for approval again
```

### Working on Multiple Features

```bash
# Scenario: Working on feat/booking while starting feat/payment

# 1. Save current work
git checkout feat/booking
git add .
git commit -m "wip: booking form in progress"
git push origin feat/booking

# 2. Switch to develop and create new branch
git checkout develop
git pull origin develop
git checkout -b feat/payment

# 3. Work on payment feature
# ...

# 4. To switch back to booking
git checkout feat/booking
# Continue working
```

### After PR is Merged

```bash
# 1. Update develop
git checkout develop
git pull origin develop

# 2. Delete your local feature branch
git branch -D feat/booking-system

# 3. Delete remote branch (if not auto-deleted)
git push origin --delete feat/booking-system

# 4. Start new feature
git checkout -b feat/new-feature
```

### Quick Reference Commands

```bash
# Check current branch
git branch

# Check status
git status

# See what changed
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes (CAREFUL!)
git reset --hard HEAD

# Save work temporarily
git stash
git stash pop  # Restore saved work

# View commit history
git log --oneline --graph

# Update from develop
git checkout your-branch
git pull origin develop
```

---

## 📅 Daily Workflow

### Project Owner Daily Checklist

**Morning (9:00 AM):**
```bash
☐ Check GitHub notifications
☐ Review new Pull Requests
☐ Check GitHub Issues
☐ Update develop branch
    git checkout develop
    git pull origin develop
☐ Check CI/CD status (if set up)
☐ Review any production errors/logs
```

**Throughout Day:**
```bash
☐ Test PR branches locally
☐ Provide feedback on PRs within 2-4 hours
☐ Approve and merge completed PRs
☐ Monitor staging environment (develop branch)
☐ Answer co-dev questions
☐ Update project board/task list
```

**Evening (5:00 PM):**
```bash
☐ Final PR review
☐ Merge develop to main (if releasing)
☐ Deploy if necessary
☐ Plan tomorrow's priorities
☐ Backup important data
```

### Co-Developer Daily Checklist

**Morning (9:00 AM):**
```bash
☐ Check for PR feedback
☐ Update develop branch
    git checkout develop
    git pull origin develop
☐ Update current feature branch
    git checkout feat/your-feature
    git merge develop
☐ Review today's tasks
☐ Check for merge conflicts
```

**Throughout Day:**
```bash
☐ Work on assigned features
☐ Commit progress every 1-2 hours
    git add .
    git commit -m "descriptive message"
    git push origin feat/your-feature
☐ Test changes frequently
☐ Keep branch synced with develop
☐ Ask questions when blocked
☐ Update PR if feedback received
```

**Evening (5:00 PM):**
```bash
☐ Commit and push final changes
☐ Create PR if feature complete
☐ Document any blockers
☐ Plan tomorrow's work
☐ Sync with project owner if needed
```

---

## 🔄 Pull Request Process

### Creating a Pull Request

#### For Co-Developers:

**Step 1: Prepare**
```bash
# 1. Ensure feature is complete
# 2. Test thoroughly
# 3. Update with latest develop
git checkout feat/your-feature
git pull origin develop
git merge origin/develop

# 4. Resolve any conflicts
# 5. Test again after merge
# 6. Push
git push origin feat/your-feature
```

**Step 2: Create PR on GitHub**
1. Navigate to repository
2. Click "Pull requests" tab
3. Click "New pull request"
4. Select:
   - Base: `develop`
   - Compare: `feat/your-feature`
5. Fill in PR template (see above)
6. Click "Create pull request"
7. Request review from @LeeDev428

### Reviewing a Pull Request

#### For Project Owner:

**Checklist for Every PR:**

```markdown
## Code Quality
- [ ] Code is clean and readable
- [ ] No commented-out code
- [ ] No console.logs or debug statements
- [ ] Proper indentation and formatting
- [ ] Functions are small and focused
- [ ] No duplicate code

## Functionality
- [ ] Feature works as expected
- [ ] No breaking changes
- [ ] Error handling implemented
- [ ] Edge cases considered
- [ ] No hardcoded values

## Security
- [ ] No sensitive data exposed
- [ ] Input validation present
- [ ] SQL injection prevention (if applicable)
- [ ] XSS prevention (if applicable)
- [ ] API endpoints secured

## Performance
- [ ] No unnecessary re-renders (React)
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Images optimized
- [ ] No blocking operations

## Testing
- [ ] Feature tested manually
- [ ] Mobile responsiveness checked
- [ ] Different browsers tested
- [ ] Error scenarios tested
- [ ] Performance acceptable

## Documentation
- [ ] README updated if needed
- [ ] API docs updated if needed
- [ ] Complex code commented
- [ ] Env variables documented
```

**Review Process:**

```bash
# 1. Fetch and checkout PR branch
git fetch origin
git checkout -b test-pr feat/booking-system

# 2. Install dependencies if package.json changed
npm install

# 3. Run the application
npm run dev

# 4. Test thoroughly:
   - Test the new feature
   - Test existing features still work
   - Test on different screen sizes
   - Test error scenarios
   - Check console for errors

# 5. Review code on GitHub:
   - Go to "Files changed"
   - Add comments on specific lines
   - Use suggestions feature for small fixes

# 6. Make decision:
   - Approve: Feature is good to merge
   - Request changes: Issues need fixing
   - Comment: Ask questions

# 7. If approved, merge:
   - Click "Squash and merge" (recommended)
   - Or "Merge pull request" (keeps commits)
   - Delete branch after merge

# 8. Clean up locally
git checkout develop
git pull origin develop
git branch -D test-pr
```

---

## 🔧 Troubleshooting Guide

### Common Issues and Solutions

#### 1. Merge Conflicts

**Problem:** When merging develop, you see:
```
CONFLICT (content): Merge conflict in frontend/src/App.js
Automatic merge failed; fix conflicts and then commit the result.
```

**Solution:**

```bash
# Step 1: See which files have conflicts
git status

# Step 2: Open conflicted file(s)
# Look for these markers:
# <<<<<<< HEAD
# Your changes
# =======
# Changes from develop
# >>>>>>> develop

# Step 3: Edit the file
# Remove markers and keep the correct code
# Example:
# <<<<<<< HEAD
# const API_URL = 'http://localhost:5000';
# =======
# const API_URL = process.env.REACT_APP_API_URL;
# >>>>>>> develop

# Choose or combine:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

# Step 4: Mark as resolved
git add frontend/src/App.js

# Step 5: Complete the merge
git commit -m "merge: resolve conflicts with develop"

# Step 6: Push
git push origin feat/your-feature

# Step 7: Test thoroughly!
npm run dev
```

**Prevention:**
```bash
# Merge develop into your branch daily
git checkout feat/your-feature
git pull origin develop
git merge origin/develop
```

#### 2. Accidentally Committed to Wrong Branch

**Problem:** Made commits to `develop` instead of feature branch

**Solution:**

```bash
# Step 1: Create new branch with current changes
git checkout -b feat/my-feature

# Step 2: Push new branch
git push origin feat/my-feature

# Step 3: Switch back to develop
git checkout develop

# Step 4: Reset develop to remote version
git reset --hard origin/develop

# Step 5: Verify develop is clean
git status

# Step 6: Continue work on feat/my-feature
git checkout feat/my-feature
```

#### 3. Need to Undo Last Commit

**Problem:** Last commit was wrong

**Solution:**

```bash
# Keep changes, undo commit
git reset --soft HEAD~1
# Fix the changes
git add .
git commit -m "correct message"

# OR discard changes completely
git reset --hard HEAD~1

# If already pushed, force push (use carefully!)
git push --force origin feat/your-feature
```

#### 4. Pushed Sensitive Data (API Keys, Passwords)

**Problem:** Accidentally committed .env file or API keys

**URGENT Solution:**

```bash
# Step 1: Remove from current version
git rm .env
git commit -m "remove sensitive file"
git push origin feat/your-feature

# Step 2: Remove from history (if committed to develop/main)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Step 3: Force push (if necessary)
git push --force origin feat/your-feature

# Step 4: IMPORTANT: Change all exposed credentials immediately!
# - Rotate API keys
# - Change passwords
# - Update MongoDB connection strings

# Step 5: Add to .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "add .env to gitignore"
```

#### 5. Branch is Behind Develop by Many Commits

**Problem:** Your feature branch is outdated

**Solution A: Merge (easier, preserves history)**

```bash
git checkout feat/your-feature
git fetch origin
git merge origin/develop
# Resolve conflicts if any
git push origin feat/your-feature
```

**Solution B: Rebase (cleaner history, advanced)**

```bash
git checkout feat/your-feature
git fetch origin
git rebase origin/develop
# Resolve conflicts step by step
git push --force origin feat/your-feature
```

#### 6. Can't Pull: Local Changes Conflict

**Problem:** 
```
error: Your local changes to the following files would be overwritten by merge
```

**Solution:**

```bash
# Option 1: Save changes temporarily
git stash
git pull origin develop
git stash pop
# Resolve any conflicts

# Option 2: Commit changes first
git add .
git commit -m "wip: save work in progress"
git pull origin develop
```

#### 7. Deleted Files by Accident

**Problem:** Deleted important files

**Solution:**

```bash
# If not committed yet
git checkout -- filename.js

# If committed but not pushed
git reset --hard HEAD~1

# If pushed (restore from history)
git log --all --full-history -- filename.js
git checkout <commit-hash> -- filename.js
```

#### 8. Node Modules Issues

**Problem:** Weird errors after pulling new code

**Solution:**

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### 9. Port Already in Use

**Problem:** `Error: Port 3000 is already in use`

**Solution:**

```powershell
# Windows (PowerShell)
# Find process using port
netstat -ano | findstr :3000
# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in package.json
# vite.config.js: port: 3001
```

#### 10. MongoDB Connection Failed

**Problem:** Can't connect to MongoDB

**Solution:**

```bash
# Check .env file
# Verify connection string is correct
MONGODB_URI=mongodb+srv://username:password@cluster...

# Check network
# Whitelist your IP in MongoDB Atlas:
# MongoDB Atlas → Network Access → Add IP Address

# Test connection
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected!')).catch(err => console.error(err))"
```

### Getting Help

**If Stuck:**

1. **Check this documentation first**
2. **Search Google/StackOverflow** with exact error message
3. **Check Git status:** `git status`
4. **Check Git log:** `git log --oneline`
5. **Ask project owner** (LeeDev428) with:
   - What you're trying to do
   - Exact error message
   - What you've already tried
   - Screenshots if applicable

**Emergency Escape (if everything is broken):**

```bash
# Nuclear option: Start fresh
cd ..
rm -rf streamrock
git clone https://github.com/LeeDev428/steamrock.git
cd streamrock
git checkout develop
npm install
```

---

## 🚀 Deployment Guide

### Pre-Deployment Checklist

```markdown
## Before Every Deployment

### Code Quality
- [ ] All PRs merged and tested on develop
- [ ] No console.logs or debug code
- [ ] No TODO comments left
- [ ] .env.example file updated
- [ ] README.md up to date

### Testing
- [ ] All features tested manually
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing done
- [ ] API endpoints tested
- [ ] Database queries optimized

### Security
- [ ] Environment variables secured
- [ ] API keys rotated if needed
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection prevention checked

### Performance
- [ ] Images optimized
- [ ] Bundle size checked
- [ ] No memory leaks
- [ ] Database indexed properly
- [ ] Caching implemented

### Dependencies
- [ ] npm audit run
- [ ] No critical vulnerabilities
- [ ] All dependencies up to date
- [ ] Unused packages removed
```

### Deployment Options

#### Option 1: Vercel + Railway (Recommended for Speed)

**Setup (One Time):**

```bash
# Frontend (Vercel)
1. Go to vercel.com
2. Sign in with GitHub
3. Import steamrock repository
4. Configure:
   - Framework: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
5. Environment Variables:
   - VITE_API_URL=https://your-backend.up.railway.app/api
6. Deploy

# Backend (Railway)
1. Go to railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub
4. Select streamrock repository
5. Configure:
   - Root Directory: backend
   - Start Command: npm start
6. Environment Variables:
   - Copy from .env
   - MONGODB_URI=your_connection_string
   - PORT=5000
7. Deploy
```

**Automatic Deployment:**
```bash
# Develop branch → Staging
1. Create preview deployment in Vercel/Railway
2. Link to develop branch
3. Auto-deploys on push to develop

# Main branch → Production
1. Create production deployment
2. Link to main branch
3. Auto-deploys on push to main
```

#### Option 2: AWS EC2 (Recommended for Control)

**Setup (One Time):**

```bash
# 1. Launch EC2 Instance
- Ubuntu 22.04 LTS
- t2.micro (free tier) or t2.small
- Configure security groups:
  - SSH (22) - Your IP
  - HTTP (80) - 0.0.0.0/0
  - HTTPS (443) - 0.0.0.0/0
  - Custom (5000) - 0.0.0.0/0 (for backend)

# 2. Connect to EC2
ssh -i "your-key.pem" ubuntu@your-ec2-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g npm@latest
sudo npm install -g pm2

# 4. Clone Repository
git clone https://github.com/LeeDev428/streamrock.git
cd streamrock

# 5. Setup Backend
cd backend
npm install
cp .env.example .env
nano .env  # Add your environment variables

# 6. Setup Frontend
cd ../frontend
npm install
npm run build

# 7. Install Nginx
sudo apt update
sudo apt install nginx

# 8. Configure Nginx
sudo nano /etc/nginx/sites-available/streamrock

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /home/ubuntu/streamrock/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/streamrock /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 9. Start Backend with PM2
cd /home/ubuntu/streamrock/backend
pm2 start server.js --name streamrock-backend
pm2 save
pm2 startup
```

**Deployment Process:**

```bash
# Create deployment script: deploy.sh
nano /home/ubuntu/deploy.sh

# Add:
#!/bin/bash
cd /home/ubuntu/streamrock

# Pull latest code
git pull origin main

# Update Backend
cd backend
npm install
pm2 restart streamrock-backend

# Update Frontend
cd ../frontend
npm install
npm run build

# Restart Nginx
sudo systemctl restart nginx

echo "Deployment complete!"

# Make executable
chmod +x /home/ubuntu/deploy.sh
```

**To Deploy:**

```bash
# On your local machine:
git push origin main

# On EC2:
ssh -i "your-key.pem" ubuntu@your-ec2-ip
./deploy.sh
```

### Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
# Production:
# VITE_API_URL=https://api.yourdomain.com/api
```

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster...
PORT=5000
NODE_ENV=development
# Production: NODE_ENV=production
```

### Post-Deployment Checklist

```markdown
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] Database connected
- [ ] Images loading
- [ ] Forms submitting
- [ ] No console errors
- [ ] SSL certificate active (if production)
- [ ] Analytics tracking (if set up)
- [ ] Error monitoring active
- [ ] Backup scheduled
```

### Monitoring

**Set up monitoring for:**

```bash
# Server uptime
# Use: UptimeRobot.com (free)

# Error tracking
# Use: Sentry.io (free tier)

# Analytics
# Use: Google Analytics

# Logs
pm2 logs streamrock-backend
tail -f /var/log/nginx/error.log
```

---

## ✅ Best Practices

### Code Standards

#### Commit Messages

**Format:**
```
<type>: <description>

[optional body]
[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
# Good
git commit -m "feat: add booking calendar component"
git commit -m "fix: resolve navbar mobile menu overflow"
git commit -m "docs: update API documentation"

# Bad
git commit -m "fixed stuff"
git commit -m "asdfgh"
git commit -m "commit"
```

#### Code Style

**JavaScript/React:**
```javascript
// Use const for constants
const API_URL = process.env.VITE_API_URL;

// Use let for variables
let count = 0;

// Use descriptive names
// Bad
const d = new Date();
// Good
const currentDate = new Date();

// Arrow functions
const handleClick = () => {
  // code
};

// Async/await over promises
const fetchData = async () => {
  try {
    const response = await axios.get('/api/properties');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Destructuring
const { name, price, location } = property;

// Template literals
const message = `Property ${name} is located in ${location}`;
```

#### File Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   ├── services/       # API services
│   ├── assets/         # Images, fonts
│   └── styles/         # Global styles

backend/
├── models/             # Database models
├── routes/             # API routes
├── controllers/        # Business logic
├── middleware/         # Custom middleware
├── utils/              # Utility functions
└── config/             # Configuration files
```

### Git Best Practices

#### Do's ✅

```bash
✅ Commit often (every 1-2 hours of work)
✅ Write clear commit messages
✅ Pull before push
✅ Test before committing
✅ Keep branches small and focused
✅ Delete merged branches
✅ Use .gitignore properly
✅ Review your own code before PR
✅ Respond to PR feedback quickly
✅ Keep commits atomic (one logical change)
```

#### Don'ts ❌

```bash
❌ Commit directly to main/develop
❌ Push broken code
❌ Commit node_modules
❌ Commit .env files
❌ Force push to shared branches
❌ Make huge PRs (>500 lines)
❌ Ignore PR feedback
❌ Leave console.logs
❌ Commit commented-out code
❌ Mix multiple features in one branch
```

### Communication

#### Daily Standup (Async)

**Post in project chat daily:**

```markdown
## Yesterday
- Completed booking form UI
- Fixed mobile navbar issue

## Today
- Implement booking API endpoint
- Add form validation

## Blockers
- Need MongoDB schema clarification for bookings
```

#### When Blocked

```markdown
Don't stay blocked for more than 2 hours!

1. Try to solve it yourself (Google, docs)
2. Check this documentation
3. Ask in project chat with:
   - What you're trying to do
   - What you've tried
   - Error messages
   - Screenshots

Format:
**Issue:** [brief description]
**Goal:** [what you're trying to achieve]
**Tried:** [what you've attempted]
**Error:** [exact error message]
**Screenshots:** [if applicable]
```

### Security

```bash
# Never commit:
- .env files
- API keys
- Passwords
- Database credentials
- Private keys
- AWS credentials

# Always:
- Use .gitignore
- Use environment variables
- Validate user input
- Sanitize database queries
- Use HTTPS in production
- Keep dependencies updated
- Use strong passwords
```

### Performance

```javascript
// Optimize React Components
import { memo } from 'react';

const PropertyCard = memo(({ property }) => {
  // Component code
});

// Use useCallback
const handleClick = useCallback(() => {
  // Handler code
}, [dependencies]);

// Use useMemo
const expensiveValue = useMemo(() => {
  return calculateExpensive(data);
}, [data]);

// Lazy load components
const PropertyDetails = lazy(() => import('./PropertyDetails'));

// Optimize images
// Use WebP format
// Compress before upload
// Use lazy loading
```

---

## 📞 Support

### When You Need Help

**Project Owner (LeeDev428):**
- GitHub: @LeeDev428
- Available: Mon-Fri, 9 AM - 6 PM
- Response time: Within 4 hours

**Emergency Contact:**
- Critical production bugs: [Your phone/email]
- Security issues: Immediately via [secure channel]

### Resources

- **GitHub Issues:** Report bugs and request features
- **Project Documentation:** Check README.md first
- **This Guide:** Reference for workflows
- **Stack Overflow:** General programming questions
- **MDN Web Docs:** JavaScript/React documentation

---

## 📝 Quick Command Reference

```bash
# Git Basics
git status                    # Check status
git branch                    # List branches
git checkout branch-name      # Switch branch
git pull origin develop       # Update from remote
git push origin branch-name   # Push to remote

# Feature Work
git checkout -b feat/name     # Create feature branch
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git push origin feat/name     # Push feature branch

# Syncing
git fetch origin              # Fetch latest from remote
git merge origin/develop      # Merge develop into current
git rebase origin/develop     # Rebase on develop

# Cleanup
git branch -d branch-name     # Delete local branch
git push origin --delete branch-name  # Delete remote
git fetch --prune             # Remove stale references

# Undo
git reset --soft HEAD~1       # Undo last commit, keep changes
git reset --hard HEAD~1       # Undo last commit, discard changes
git checkout -- file.js       # Discard file changes
git stash                     # Save work temporarily
git stash pop                 # Restore saved work

# Info
git log --oneline             # View commit history
git diff                      # See changes
git remote -v                 # See remote URLs
```

---

**Last Updated:** January 28, 2026  
**Version:** 1.0.0  
**Maintained by:** LeeDev428

---

## 💡 Remember

> "Commit early, commit often, push frequently!"

> "When in doubt, create a PR. Better to ask than to break production!"

> "Test locally, test on develop, then test again on main!"

**Good luck and happy coding! 🚀**
