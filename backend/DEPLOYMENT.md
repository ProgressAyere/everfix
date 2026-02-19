# Deployment Guide

## Overview
This guide covers deploying the Phone Repair Platform backend to production environments.

## Deployment Options

### Option 1: AWS (Recommended for Scale)
- **Compute**: AWS EC2 or AWS ECS (Docker)
- **Database**: AWS RDS (PostgreSQL)
- **Cache**: AWS ElastiCache (Redis)
- **Storage**: AWS S3
- **Face Recognition**: AWS Rekognition
- **Load Balancer**: AWS ALB
- **CDN**: AWS CloudFront

### Option 2: Heroku (Quick & Easy)
- **Compute**: Heroku Dynos
- **Database**: Heroku Postgres
- **Cache**: Heroku Redis
- **Storage**: AWS S3 or Cloudinary
- **Face Recognition**: AWS Rekognition or Azure Face API

### Option 3: DigitalOcean (Cost-Effective)
- **Compute**: DigitalOcean Droplets
- **Database**: DigitalOcean Managed PostgreSQL
- **Cache**: DigitalOcean Managed Redis
- **Storage**: DigitalOcean Spaces or AWS S3
- **Face Recognition**: AWS Rekognition

### Option 4: Railway/Render (Modern Platform)
- **Compute**: Railway/Render Services
- **Database**: Managed PostgreSQL
- **Cache**: Managed Redis
- **Storage**: AWS S3
- **Face Recognition**: AWS Rekognition

---

## Pre-Deployment Checklist

### Code Preparation
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] API documentation complete
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Security audit completed

### Infrastructure Preparation
- [ ] Production database created
- [ ] Redis instance provisioned
- [ ] S3 bucket created
- [ ] AWS Rekognition collection created
- [ ] Domain name registered
- [ ] SSL certificate obtained
- [ ] Payment gateway configured (live keys)
- [ ] SMS service configured (live keys)
- [ ] Email service configured

### Monitoring & Alerts
- [ ] Error tracking setup (Sentry)
- [ ] Performance monitoring setup
- [ ] Uptime monitoring setup
- [ ] Log aggregation setup
- [ ] Alert notifications configured

---

## Deployment Steps

## Option 1: AWS Deployment (Detailed)

### Step 1: Setup AWS Account
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
```

### Step 2: Create RDS PostgreSQL Database
```bash
# Via AWS Console:
1. Go to RDS → Create Database
2. Choose PostgreSQL 14+
3. Select Production template
4. Configure:
   - DB instance: db.t3.medium (or larger)
   - Storage: 100GB SSD
   - Multi-AZ: Yes (for high availability)
   - VPC: Create new or use existing
   - Public access: No
   - Security group: Create new
5. Note down endpoint and credentials
```

### Step 3: Create ElastiCache Redis
```bash
# Via AWS Console:
1. Go to ElastiCache → Create Redis cluster
2. Configure:
   - Node type: cache.t3.medium
   - Number of replicas: 1
   - VPC: Same as RDS
   - Security group: Allow access from EC2
3. Note down endpoint
```

### Step 4: Create S3 Bucket
```bash
# Create bucket
aws s3 mb s3://phonefix-production-uploads --region us-east-1

# Configure bucket policy (public read for images)
aws s3api put-bucket-policy --bucket phonefix-production-uploads --policy file://bucket-policy.json

# Enable CORS
aws s3api put-bucket-cors --bucket phonefix-production-uploads --cors-configuration file://cors-config.json
```

**bucket-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::phonefix-production-uploads/*"
    }
  ]
}
```

**cors-config.json:**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### Step 5: Setup AWS Rekognition
```bash
# Create face collection
aws rekognition create-collection --collection-id phonefix-production-faces --region us-east-1

# Verify collection
aws rekognition list-collections --region us-east-1
```

### Step 6: Launch EC2 Instance
```bash
# Via AWS Console:
1. Go to EC2 → Launch Instance
2. Choose Ubuntu 22.04 LTS
3. Instance type: t3.medium (2 vCPU, 4GB RAM)
4. Configure:
   - VPC: Same as RDS
   - Security group: Allow SSH (22), HTTP (80), HTTPS (443), Custom (5000)
   - Key pair: Create new or use existing
5. Launch instance
6. Allocate Elastic IP and associate with instance
```

### Step 7: Connect and Setup Server
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-elastic-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### Step 8: Clone and Setup Application
```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/phonefix-backend.git
cd phonefix-backend/backend

# Install dependencies
sudo npm install --production

# Create .env file
sudo nano .env
# Paste production environment variables

# Build TypeScript
sudo npm run build

# Run database migrations
sudo npx prisma migrate deploy
```

### Step 9: Configure PM2
```bash
# Create PM2 ecosystem file
sudo nano ecosystem.config.js
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'phonefix-api',
    script: './dist/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

```bash
# Start application with PM2
sudo pm2 start ecosystem.config.js

# Save PM2 configuration
sudo pm2 save

# Setup PM2 to start on boot
sudo pm2 startup systemd
```

### Step 10: Configure Nginx
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/phonefix-api
```

**phonefix-api:**
```nginx
upstream api_backend {
    server 127.0.0.1:5000;
    keepalive 64;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Increase upload size for file uploads
    client_max_body_size 10M;

    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support for Socket.io
    location /socket.io/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/phonefix-api /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 11: Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 12: Setup Firewall
```bash
# Configure UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Step 13: Setup Database Backups
```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

**backup-db.sh:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/postgresql"
DB_NAME="phonefix"
DB_HOST="your-rds-endpoint"
DB_USER="your-db-user"

mkdir -p $BACKUP_DIR

PGPASSWORD="your-db-password" pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://phonefix-backups/database/

# Delete local backups older than 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-db.sh
```

---

## Option 2: Heroku Deployment (Quick)

### Step 1: Install Heroku CLI
```bash
curl https://cli-assets.heroku.com/install.sh | sh
heroku login
```

### Step 2: Create Heroku App
```bash
cd backend
heroku create phonefix-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Add Redis
heroku addons:create heroku-redis:premium-0

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set AWS_ACCESS_KEY_ID=your-key
# ... set all other env vars
```

### Step 3: Create Procfile
```bash
echo "web: npm run start:prod" > Procfile
```

### Step 4: Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Check logs
heroku logs --tail
```

---

## Option 3: Docker Deployment

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
```

### Step 2: Create docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/phonefix
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: phonefix
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Step 3: Deploy
```bash
docker-compose up -d
```

---

## Post-Deployment

### Verify Deployment
```bash
# Check API health
curl https://api.yourdomain.com/health

# Check database connection
curl https://api.yourdomain.com/api/health/db

# Check Redis connection
curl https://api.yourdomain.com/api/health/redis
```

### Monitor Application
```bash
# PM2 monitoring
pm2 monit

# Check logs
pm2 logs

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Setup Monitoring Services
1. **Sentry** - Error tracking
2. **New Relic** - Performance monitoring
3. **UptimeRobot** - Uptime monitoring
4. **CloudWatch** - AWS metrics

---

## Scaling Strategies

### Horizontal Scaling
- Add more EC2 instances
- Use Application Load Balancer
- Implement session sharing via Redis
- Use read replicas for database

### Vertical Scaling
- Upgrade EC2 instance type
- Increase RDS instance size
- Increase Redis memory

### Caching Strategy
- Cache frequently accessed data in Redis
- Use CDN for static assets
- Implement API response caching

---

## Rollback Procedure

### If Deployment Fails
```bash
# PM2 rollback
pm2 stop all
git checkout previous-commit
npm install
npm run build
pm2 restart all

# Database rollback
npx prisma migrate resolve --rolled-back migration-name
```

---

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update
npm audit fix

# Update system packages
sudo apt update && sudo apt upgrade

# Restart services
pm2 restart all
sudo systemctl restart nginx
```

### Database Maintenance
```bash
# Vacuum database
PGPASSWORD="password" psql -h endpoint -U user -d phonefix -c "VACUUM ANALYZE;"

# Check database size
PGPASSWORD="password" psql -h endpoint -U user -d phonefix -c "SELECT pg_size_pretty(pg_database_size('phonefix'));"
```

---

## Troubleshooting

### Common Issues

**Issue: Application won't start**
```bash
# Check logs
pm2 logs
# Check environment variables
pm2 env 0
# Check port availability
sudo netstat -tulpn | grep 5000
```

**Issue: Database connection fails**
```bash
# Test connection
PGPASSWORD="password" psql -h endpoint -U user -d phonefix
# Check security group rules
# Verify DATABASE_URL in .env
```

**Issue: High memory usage**
```bash
# Check PM2 memory
pm2 list
# Restart application
pm2 restart all
# Consider increasing instance size
```

---

## Security Checklist

- [ ] All environment variables secured
- [ ] Database not publicly accessible
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers added
- [ ] Regular backups scheduled
- [ ] Monitoring and alerts setup
- [ ] Access logs enabled

---

## Support

For deployment issues, contact:
- DevOps Team: devops@phonefix.com
- Emergency: +234-XXX-XXX-XXXX
