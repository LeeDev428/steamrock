# 🚀 Deployment Guide - Streamrock Realty

**Repository:** https://github.com/LeeDev428/steamrock  
**Last Updated:** January 28, 2026

---

## 📋 Table of Contents

1. [Deployment Options Comparison](#deployment-options-comparison)
2. [Option 1: Vercel + Railway (Easiest)](#option-1-vercel--railway-easiest)
3. [Option 2: AWS EC2 (Most Control)](#option-2-aws-ec2-most-control)
4. [Option 3: DigitalOcean (Balanced)](#option-3-digitalocean-balanced)
5. [CI/CD Setup](#cicd-setup)
6. [Environment Management](#environment-management)
7. [Post-Deployment](#post-deployment)

---

## 🔍 Deployment Options Comparison

| Feature | Vercel + Railway | AWS EC2 | DigitalOcean |
|---------|-----------------|---------|--------------|
| **Setup Time** | 10-15 minutes | 1-2 hours | 30-45 minutes |
| **Cost (monthly)** | Free - $20 | $5 - $50 | $6 - $40 |
| **Auto Deploy** | ✅ Yes | ⚠️ Manual/CI | ⚠️ Manual/CI |
| **SSL Certificate** | ✅ Auto | ⚠️ Manual | ⚠️ Manual |
| **Scaling** | ✅ Auto | ⚠️ Manual | ⚠️ Manual |
| **Control** | ⚠️ Limited | ✅ Full | ✅ Full |
| **Maintenance** | ✅ Low | ❌ High | ⚠️ Medium |
| **Best For** | Small-Medium | Enterprise | Medium-Large |

### 🎯 Recommendation

**For Streamrock Project:**
- **Development:** Vercel + Railway (fast iteration)
- **Production:** AWS EC2 or DigitalOcean (more control)
- **Start with:** Vercel + Railway, migrate later if needed

---

## Option 1: Vercel + Railway (Easiest)

### 🎨 Frontend on Vercel

**Step 1: Initial Setup (15 minutes)**

1. **Sign Up**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub account
   - Authorize Vercel to access your repositories

2. **Import Project**
   ```
   Dashboard → New Project → Import Git Repository
   → Select: LeeDev428/steamrock
   → Click Import
   ```

3. **Configure Build Settings**
   ```yaml
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   ```
   Settings → Environment Variables → Add
   
   Name: VITE_API_URL
   Value: https://steamrock-backend.up.railway.app/api
   Environments: Production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get URL: https://steamrock.vercel.app

**Step 2: Custom Domain (Optional)**

```
Settings → Domains → Add Domain
→ Enter your domain: www.steamrockrealty.com
→ Follow DNS configuration instructions
```

**Step 3: Configure Branch Deployments**

```
Settings → Git → Production Branch: main
Settings → Git → Preview Deployments: ✅ develop branch

Result:
- Push to main → Production deployment
- Push to develop → Preview deployment at steamrock-git-develop.vercel.app
```

### 🔧 Backend on Railway

**Step 1: Initial Setup (15 minutes)**

1. **Sign Up**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub account
   - Authorize Railway

2. **Create New Project**
   ```
   New Project → Deploy from GitHub repo
   → Select: LeeDev428/steamrock
   → Select service type: Empty Service
   ```

3. **Configure Service**
   ```yaml
   Settings → Service Name: steamrock-backend
   Settings → Root Directory: backend
   Settings → Start Command: npm start
   Settings → Build Command: npm install
   ```

4. **Add Environment Variables**
   ```
   Variables tab → Add Variable
   
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/steamrock
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://steamrock.vercel.app
   ```

5. **Deploy**
   - Railway auto-deploys
   - Get URL: https://steamrock-backend.up.railway.app
   - Test: https://steamrock-backend.up.railway.app/api/health

**Step 2: Configure MongoDB Access**

```
MongoDB Atlas → Network Access → Add IP Address
→ Allow Access from Anywhere: 0.0.0.0/0
(Railway has dynamic IPs)
```

**Step 3: Update Frontend Environment**

```
Go back to Vercel:
Settings → Environment Variables → Edit VITE_API_URL
Value: https://steamrock-backend.up.railway.app/api
→ Redeploy
```

### 📊 Monitoring

**Vercel:**
```
Analytics → View deployment logs
Speed Insights → Monitor performance
```

**Railway:**
```
Observability → View logs
Metrics → Monitor CPU/Memory
```

### 💰 Cost Estimate

**Free Tier:**
- Vercel: 100 GB bandwidth/month
- Railway: $5 free credit/month (runs ~1 week)

**Paid (recommended for production):**
- Vercel Pro: $20/month (unlimited projects)
- Railway: ~$10-15/month for small backend

**Total: ~$30-35/month**

---

## Option 2: AWS EC2 (Most Control)

### 🖥️ Server Setup (1-2 hours)

**Step 1: Launch EC2 Instance**

1. **AWS Console**
   ```
   EC2 Dashboard → Launch Instance
   
   Name: steamrock-production
   AMI: Ubuntu Server 22.04 LTS (free tier eligible)
   Instance Type: t2.small (or t2.micro for testing)
   Key Pair: Create new → Download steamrock-key.pem
   ```

2. **Configure Security Group**
   ```
   Create security group: steamrock-sg
   
   Inbound Rules:
   - SSH (22) → Source: My IP (your IP)
   - HTTP (80) → Source: 0.0.0.0/0
   - HTTPS (443) → Source: 0.0.0.0/0
   - Custom TCP (5000) → Source: 0.0.0.0/0 (backend API)
   ```

3. **Launch Instance**
   - Wait 2-3 minutes for instance to start
   - Note Public IPv4 address: `54.123.456.789`

**Step 2: Connect to Server**

```bash
# Save your key file
Move-Item ~/Downloads/steamrock-key.pem ~/.ssh/
# Set permissions (Git Bash or WSL)
chmod 400 ~/.ssh/steamrock-key.pem

# Connect
ssh -i ~/.ssh/steamrock-key.pem ubuntu@54.123.456.789
```

**Step 3: Install Dependencies**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version  # Should be v18.x.x
npm --version   # Should be 9.x.x

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Web Server)
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

**Step 4: Clone and Setup Project**

```bash
# Clone repository
cd /home/ubuntu
git clone https://github.com/LeeDev428/steamrock.git
cd steamrock

# Setup Backend
cd backend
npm install

# Create environment file
nano .env
```

**Add to .env:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/steamrock
PORT=5000
NODE_ENV=production
```

```bash
# Test backend
npm start
# Press Ctrl+C to stop

# Setup Frontend
cd ../frontend
npm install
npm run build
# Creates optimized build in dist/
```

**Step 5: Configure Nginx**

```bash
# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Create new config
sudo nano /etc/nginx/sites-available/steamrock
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name 54.123.456.789;  # Replace with your IP or domain

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend - Serve React app
    location / {
        root /home/ubuntu/steamrock/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API - Proxy to Node.js
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5000/api/health;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/steamrock /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

**Step 6: Start Backend with PM2**

```bash
cd /home/ubuntu/steamrock/backend

# Start with PM2
pm2 start server.js --name steamrock-backend

# Configure PM2 to start on boot
pm2 startup
# Copy and run the command it shows

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs steamrock-backend
```

**Step 7: Test Deployment**

```bash
# Open in browser:
http://54.123.456.789

# Test API:
http://54.123.456.789/api/health
http://54.123.456.789/api/properties
```

### 🔒 Step 8: SSL Certificate (HTTPS)

**Option A: Using Certbot (Let's Encrypt - Free)**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot --nginx -d steamrockrealty.com -d www.steamrockrealty.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose: Redirect HTTP to HTTPS

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

**Update Nginx config will be automatic. Your site now runs on HTTPS!**

### 🔄 Deployment Script

**Create deployment script:**

```bash
nano /home/ubuntu/deploy.sh
```

**Add:**
```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Navigate to project
cd /home/ubuntu/steamrock

# Backup current version
BACKUP_DIR="$HOME/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r backend "$BACKUP_DIR/"
cp -r frontend/dist "$BACKUP_DIR/"
echo "✅ Backup created at $BACKUP_DIR"

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Update Backend
echo "🔧 Updating backend..."
cd backend
npm install --production
pm2 restart steamrock-backend
cd ..

# Update Frontend
echo "🎨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

# Health check
echo "🏥 Running health check..."
sleep 3
curl -f http://localhost:5000/api/health || {
    echo "❌ Health check failed! Rolling back..."
    pm2 restart steamrock-backend
    exit 1
}

echo "✅ Deployment complete!"
echo "🌐 Visit: http://$(curl -s ifconfig.me)"

# Show logs
pm2 logs steamrock-backend --lines 20
```

```bash
# Make executable
chmod +x /home/ubuntu/deploy.sh
```

### 📊 Monitoring Setup

```bash
# Monitor PM2 processes
pm2 monit

# View logs
pm2 logs steamrock-backend
pm2 logs steamrock-backend --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System resources
htop
df -h  # Disk usage
free -h  # Memory usage
```

### 💰 Cost Estimate

**AWS EC2:**
- t2.micro (1 vCPU, 1GB RAM): Free tier / $8.50/month
- t2.small (1 vCPU, 2GB RAM): ~$17/month
- t2.medium (2 vCPU, 4GB RAM): ~$34/month

**Recommendation:** Start with t2.small ($17/month)

**Additional Costs:**
- Elastic IP: $0 (if attached), $3.65/month (if not)
- Data transfer: First 100GB free, then $0.09/GB
- Route 53 (DNS): $0.50/month per hosted zone

**Total: ~$20-25/month for small production**

---

## Option 3: DigitalOcean (Balanced)

### 🌊 Droplet Setup

**Step 1: Create Droplet**

```
DigitalOcean → Create → Droplets

Choose Image: Ubuntu 22.04 LTS
Choose Plan: Basic → $6/month (1GB RAM, 1 vCPU)
Choose Datacenter: Closest to your users
Authentication: SSH Key (recommended) or Password
Hostname: steamrock-production

→ Create Droplet
```

**Step 2: Setup (Similar to AWS EC2)**

```bash
# Connect
ssh root@your-droplet-ip

# Follow same steps as AWS EC2 from Step 3 onwards
```

**Advantages over AWS:**
- Simpler interface
- Predictable pricing
- Better documentation
- Free outbound bandwidth

**Disadvantages:**
- Less scalability options
- Fewer regions
- Less enterprise features

### 💰 Cost Estimate

- Basic Droplet: $6-12/month
- Load Balancer (optional): $12/month
- Managed Database (optional): $15/month

**Total: $6-40/month depending on needs**

---

## 🔄 CI/CD Setup (GitHub Actions)

### Automatic Deployment on Git Push

**Create workflow file:**

```bash
# On your local machine
cd d:\Programming\Systems\Web-Systems\MERN\steamrock
mkdir -p .github/workflows
nano .github/workflows/deploy.yml
```

**Add configuration:**

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/steamrock
            git pull origin main
            cd backend && npm install && pm2 restart streamrock-backend
            cd ../frontend && npm install && npm run build
            sudo systemctl restart nginx
            echo "Deployment complete!"
      
      - name: Health Check
        run: |
          sleep 5
          curl -f http://${{ secrets.EC2_HOST }}/api/health

      - name: Notify on Slack (optional)
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment to production ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

**Add GitHub Secrets:**

```
GitHub Repository → Settings → Secrets and variables → Actions

Add:
- EC2_HOST: Your EC2 IP address
- EC2_SSH_KEY: Contents of steamrock-key.pem file
- SLACK_WEBHOOK: (optional) Slack webhook URL
```

**Now when you push to main:**
```bash
git push origin main
# → GitHub Actions automatically deploys to EC2!
```

---

## 🌍 Environment Management

### Development Environment

```env
# backend/.env.development
MONGODB_URI=mongodb://localhost:27017/steamrock-dev
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

```env
# frontend/.env.development
VITE_API_URL=http://localhost:5000/api
```

### Staging Environment (Develop Branch)

```env
# backend/.env.staging
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/steamrock-staging
PORT=5000
NODE_ENV=staging
CORS_ORIGIN=https://steamrock-staging.vercel.app
```

```env
# frontend/.env.staging
VITE_API_URL=https://steamrock-backend-staging.railway.app/api
```

### Production Environment

```env
# backend/.env.production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/steamrock
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://steamrockrealty.com
```

```env
# frontend/.env.production
VITE_API_URL=https://api.steamrockrealty.com/api
```

---

## ✅ Post-Deployment Checklist

### Immediately After Deployment

```markdown
- [ ] Site loads at domain/IP
- [ ] Frontend shows correctly
- [ ] API endpoints respond
  - [ ] GET /api/properties
  - [ ] POST /api/inquiries
  - [ ] GET /api/health
- [ ] Database connected
- [ ] Images load correctly
- [ ] Forms submit successfully
- [ ] Mobile responsive
- [ ] No console errors
- [ ] HTTPS working (if configured)
```

### Within 24 Hours

```markdown
- [ ] Set up monitoring
  - [ ] UptimeRobot for uptime
  - [ ] Sentry for errors
  - [ ] Google Analytics for traffic
- [ ] Configure backups
  - [ ] MongoDB Atlas automatic backups
  - [ ] Code backup (GitHub)
  - [ ] Server snapshot
- [ ] Test all features end-to-end
- [ ] Load testing (optional)
- [ ] Security scan
```

### Within 1 Week

```markdown
- [ ] Set up alerts
  - [ ] Email notifications for downtime
  - [ ] Slack webhook for deployments
  - [ ] Error tracking
- [ ] Document runbook
- [ ] Train team on deployment process
- [ ] Set up staging environment
- [ ] Create rollback plan
```

---

## 🚨 Rollback Procedure

### If Something Goes Wrong

**Immediate Rollback (EC2):**

```bash
# SSH to server
ssh -i ~/.ssh/steamrock-key.pem ubuntu@your-ip

# Check backup directories
ls -la ~/backups/

# Restore from latest backup
LATEST_BACKUP=$(ls -t ~/backups/ | head -1)
cd /home/ubuntu/steamrock

# Restore backend
cp -r ~/backups/$LATEST_BACKUP/backend/* backend/
cd backend && npm install
pm2 restart steamrock-backend

# Restore frontend
cp -r ~/backups/$LATEST_BACKUP/dist/* frontend/dist/

# Restart services
sudo systemctl restart nginx

# Verify
curl http://localhost:5000/api/health
```

**Rollback via Git:**

```bash
# Find last working commit
git log --oneline

# Revert to that commit
git revert <commit-hash>
git push origin main

# Or reset (destructive)
git reset --hard <commit-hash>
git push --force origin main
```

---

## 📞 Support Contacts

**Infrastructure Issues:**
- AWS: https://console.aws.amazon.com/support
- Vercel: https://vercel.com/support
- Railway: https://help.railway.app/

**Monitoring:**
- Status page: Create one at statuspage.io
- Alerts: Configure in monitoring tools

---

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)

---

**Last Updated:** January 28, 2026  
**Maintained by:** LeeDev428

---

**Good luck with deployment! 🚀**
