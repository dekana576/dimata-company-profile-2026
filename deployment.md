# Deployment Guide - VPS Ubuntu 22.04

Panduan deployment Dimata Company Profile ke VPS Ubuntu 22.04 dengan Nginx reverse proxy.

## Prerequisites

- VPS Ubuntu 22.04 (minimal 1GB RAM)
- Domain name pointing ke VPS IP
- Root access atau sudo user
- MySQL 8 / MariaDB installed
- Node.js 20+ installed (Prisma 7.8.0 butuh `^20.19 || ^22.12 || >=24.0`)

---

## 1. Server Setup

### Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js 20

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node -v  # v20.x.x
npm -v
```

### Install PM2

```bash
npm install -g pm2
```

### Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
```

### Install MySQL / MariaDB

```bash
# MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# ATAU MariaDB
sudo apt install mariadb-server -y
sudo systemctl enable mariadb
sudo mysql_secure_installation
```

---

## 2. MySQL Setup

### Create Database

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE dimata_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'dimata'@'localhost' IDENTIFIED BY 'your-secure-password';
GRANT ALL PRIVILEGES ON dimata_cms.* TO 'dimata'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 3. Deploy Application

### Clone Repository

```bash
cd /var/www
sudo git clone <your-repo-url> dimata-company-profile
cd dimata-company-profile
sudo chown -R $USER:$USER .
```

### Setup Environment

```bash
cp .env.example .env
nano .env
```

Update values:

```env
DATABASE_URL="mysql://dimata:your-secure-password@localhost:3306/dimata_cms"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_TO=recipient@gmail.com
CMS_ADMIN_EMAIL=admin@dimata.com
CMS_ADMIN_PASSWORD=your-admin-password
JWT_SECRET=your-random-secret-min-32-characters
```

### Install Dependencies & Build

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run build
```

> **Penting:** `npx prisma generate` wajib dijalankan sebelum `migrate deploy`. Prisma 7 memerlukan generated client sebelum bisa connect ke database.

### Create Upload Directory

```bash
mkdir -p public/uploads/events
chmod -R 755 public/uploads
```

### Start with PM2

```bash
# Start app
pm2 start npm --name "dimata" -- run start

# Save PM2 config
pm2 save

# Auto-start on reboot
pm2 startup
# Follow the instruction shown
```

### PM2 Commands

```bash
pm2 list              # List all apps
pm2 logs dimata       # View logs
pm2 restart dimata    # Restart app
pm2 stop dimata       # Stop app
pm2 delete dimata     # Delete app
pm2 monit             # Monitor dashboard
```

---

## 4. Nginx Configuration

### Step 1: HTTP-Only Config (Setup Pertama)

> **Jangan langsung pakai SSL** karena sertifikat belum ada. Setup HTTP dulu, lalu jalankan Certbot.

```bash
sudo nano /etc/nginx/sites-available/dimata
```

Paste config HTTP-only:

```nginx
server {
    listen 80;
    server_name dimata.com www.dimata.com;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    # Proxy to Next.js (port 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache Next.js Static Assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Cache Uploaded Images
    location /uploads {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Favicon
    location /favicon.ico {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 7d;
    }
}
```

### Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/dimata /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Test HTTP

```bash
curl -I http://dimata.com
# Harusnya return HTTP 200
```

---

## 5. SSL Certificate (Let's Encrypt)

### Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Get SSL Certificate

```bash
sudo certbot --nginx -d dimata.com -d www.dimata.com
```

Follow the prompts:
1. Enter email address
2. Agree to terms
3. Choose redirect (option 2 - Redirect all HTTP to HTTPS)

### Verify SSL

```bash
sudo certbot renew --dry-run
curl -I https://dimata.com
# Harusnya return HTTP 200 dengan SSL
```

### Auto-Renewal

Certbot otomatis setup auto-renewal via systemd timer. Verify:

```bash
sudo systemctl status certbot.timer
```

---

## 6. Firewall Setup

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## 7. Verify Deployment

### Check Services

```bash
# Check Next.js (PM2)
pm2 list

# Check Nginx
sudo systemctl status nginx

# Check MySQL
sudo systemctl status mysql
```

### Check Logs

```bash
# Next.js logs
pm2 logs dimata

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Test Endpoints

```bash
# Homepage
curl -I https://dimata.com

# Events page
curl -I https://dimata.com/events

# API
curl https://dimata.com/api/events

# CMS Login
curl -I https://dimata.com/cms/login
```

---

## 8. Updating the Application

Saat ada update dari GitHub:

```bash
cd /var/www/dimata-company-profile

# Pull latest changes
git pull origin main

# Install dependencies (jika ada yang baru)
npm install

# Generate Prisma client (WAJIB sebelum migrate)
npx prisma generate

# Run migrations (jika ada schema change)
npx prisma migrate deploy

# Rebuild
npm run build

# Create uploads directory if needed
mkdir -p public/uploads/events

# Restart app
pm2 restart dimata
```

### Quick Update Script

Simpan sebagai `update.sh` untuk kemudahan:

```bash
#!/bin/bash
cd /var/www/dimata-company-profile
git pull origin main
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
mkdir -p public/uploads/events
pm2 restart dimata
echo "✅ Deploy complete!"
```

Buat executable:
```bash
chmod +x update.sh
```

Jalankan:
```bash
./update.sh
```

---

## 9. Troubleshooting

### App Not Starting

```bash
# Check PM2 logs
pm2 logs dimata

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart PM2
pm2 restart all
```

### Nginx 502 Bad Gateway

```bash
# Check if Next.js is running
pm2 list

# Check port 3000
curl http://localhost:3000

# Restart nginx
sudo systemctl restart nginx
```

### Database Connection Error

```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u dimata -p -h localhost dimata_cms

# Check .env DATABASE_URL
cat .env | grep DATABASE_URL
```

### SSL Certificate Error

```bash
# Check certificate status
sudo certbot certificates

# Renew if needed
sudo certbot renew

# Check nginx config
sudo nginx -t
```

### Prisma Client Error

```bash
# Clear cache and regenerate
rm -rf node_modules/.prisma
npx prisma generate

# If still fails, full clean install
rm -rf node_modules
npm install
npx prisma generate
```

### Permission Issues

```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/dimata-company-profile

# Fix upload directory
chmod -R 755 /var/www/dimata-company-profile/public/uploads
```

---

## 10. Backup

### Database Backup

```bash
# Manual backup
mysqldump -u dimata -p dimata_cms > backup_$(date +%Y%m%d).sql

# Automated daily backup (add to crontab)
crontab -e
# Add: 0 2 * * * mysqldump -u dimata -p'password' dimata_cms | gzip > /var/backups/dimata_$(date +\%Y\%m\%d).sql.gz
```

### Upload Directory Backup

```bash
# Backup uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /var/www/dimata-company-profile/public/uploads
```

---

## Quick Reference

| Service | Port | Command |
|---------|------|---------|
| Next.js | 3000 | `pm2 restart dimata` |
| Nginx | 80, 443 | `sudo systemctl restart nginx` |
| MySQL | 3306 | `sudo systemctl restart mysql` |

## URLs

| URL | Description |
|-----|-------------|
| https://dimata.com | Main website |
| https://dimata.com/events | Events page |
| https://dimata.com/cms | CMS Admin |
| https://dimata.com/api/events | Events API |

## Default CMS Credentials

| Field | Value |
|-------|-------|
| Email | Set in `.env` (`CMS_ADMIN_EMAIL`) |
| Password | Set in `.env` (`CMS_ADMIN_PASSWORD`) |

> **Important**: Change default credentials after first login!
