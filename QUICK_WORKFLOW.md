# ⚡ Quick Workflow Reference

**For:** Fast daily reference  
**Detailed Guide:** See [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md)

---

## 🎯 Project Owner Quick Commands

### 📋 Daily Routine
```bash
# Morning
git checkout develop
git pull origin develop

# Review PRs → GitHub → Pull Requests → Files changed
# Test locally:
git fetch origin
git checkout -b test-pr origin/feat/branch-name
npm install && npm run dev

# Merge if good → GitHub → Approve → Squash and merge → Delete branch
```

### 🚀 Deploy to Production
```bash
# 1. Test develop thoroughly
git checkout develop && git pull origin develop

# 2. Create PR: develop → main on GitHub
# 3. Add release notes
# 4. Merge to main
# 5. Tag release
git checkout main && git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 6. Deploy (run on server)
./deploy.sh
```

### 🔥 Hotfix (Emergency)
```bash
git checkout main && git pull origin main
git checkout -b hotfix/critical-bug
# Fix bug
git add . && git commit -m "hotfix: description"
git push origin hotfix/critical-bug
# Create PR → main → Merge → Deploy
# Then merge to develop too
git checkout develop && git merge main && git push origin develop
```

---

## 👨‍💻 Co-Dev Quick Commands

### 🎬 Start New Feature
```bash
# ALWAYS from develop
git checkout develop
git pull origin develop
git checkout -b feat/feature-name

# Work, commit frequently
git add . && git commit -m "feat: description"
git push origin feat/feature-name
```

### 🔄 Daily Sync (Do EVERY morning!)
```bash
git checkout develop
git pull origin develop
git checkout feat/your-feature
git merge develop
# Resolve conflicts if any
npm run dev  # Test!
git push origin feat/your-feature
```

### 📤 Create Pull Request
```bash
# 1. Final sync
git checkout feat/your-feature
git pull origin develop
git merge origin/develop

# 2. Test everything
npm run dev

# 3. Push
git push origin feat/your-feature

# 4. GitHub → New PR → Base: develop ← Compare: feat/your-feature
# 5. Fill template, request review from @LeeDev428
# 6. WAIT for approval
```

### 🔧 Fix PR Feedback
```bash
# Make requested changes
git add . && git commit -m "fix: address review comments"
git push origin feat/your-feature
# PR auto-updates
```

### ✅ After Merge
```bash
git checkout develop
git pull origin develop
git branch -D feat/your-feature
git push origin --delete feat/your-feature
# Start new feature
```

---

## 🚨 Emergency Fixes

### Merge Conflict
```bash
git status  # See conflicted files
# Open file, find <<<<<<< HEAD markers
# Edit to keep correct code
git add resolved-file.js
git commit -m "merge: resolve conflicts"
git push origin your-branch
```

### Wrong Branch
```bash
git checkout -b feat/correct-branch  # New branch with changes
git push origin feat/correct-branch
git checkout develop
git reset --hard origin/develop
```

### Undo Last Commit
```bash
git reset --soft HEAD~1  # Keep changes
# OR
git reset --hard HEAD~1  # Discard changes
```

### Port In Use
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📋 PR Template (Copy-Paste)

```markdown
## 📝 Description
[What does this PR do?]

## 🎯 Type
- [ ] Bug fix
- [ ] New feature
- [ ] Design change
- [ ] Refactoring

## ✨ Changes
- Added/Fixed/Changed X
- Added/Fixed/Changed Y

## 🧪 Testing
- [x] Tested feature works
- [x] Tested on mobile
- [x] No console errors
- [x] Tested with latest develop

## 📋 Checklist
- [x] Code clean, no debug code
- [x] Comments for complex code
- [x] No breaking changes

## 🔗 Issues
Closes #[issue number]
```

---

## ✅ Pre-Deployment Checklist

```markdown
- [ ] All PRs merged to develop
- [ ] Tested on develop
- [ ] No console.logs
- [ ] .env.example updated
- [ ] Mobile tested
- [ ] API endpoints work
- [ ] Database connected
- [ ] npm audit passed
```

---

## 📞 Quick Help

**Stuck?** Check this order:
1. [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) - Full guide
2. Google the error
3. Ask @LeeDev428 with error details

**Emergency?** Contact project owner immediately

---

## 🎯 Remember

✅ **Branch from develop, PR to develop**  
✅ **Sync with develop daily**  
✅ **Test before PR**  
✅ **Never push directly to main/develop**  
✅ **Commit often, push frequently**  

❌ **Never commit .env files**  
❌ **Never force push to shared branches**  
❌ **Never ignore PR feedback**  

---

**Need more details?** → [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md)
