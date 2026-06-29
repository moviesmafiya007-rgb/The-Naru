# 5. Deployment Guide

## Complete Deployment Instructions for The Naru Platform

---

## Deployment Options

### Option 1: Heroku Deployment (Quickest)

#### Prerequisites
- Heroku CLI installed
- Git repository initialized
- PostgreSQL database (use Heroku Postgres)

#### Steps

**1. Create Heroku Apps**

```bash
# Create backend app
heroku create the-naru-backend --buildpack heroku/nodejs

# Create frontend app
heroku create the-naru-frontend --buildpack heroku/static
```

**2. Add PostgreSQL Database**

```bash
# Add PostgreSQL to backend
heroku addons:create heroku-postgresql:hobby-dev -a the-naru-backend

# Get database URL
heroku config -a the-naru-backend
```

**3. Set Environment Variables**

```bash
heroku config:set NODE_ENV=production -a the-naru-backend
heroku config:set JWT_SECRET=your_super_secret_key -a the-naru-backend
heroku config:set JWT_EXPIRE=7d -a the-naru-backend
heroku config:set STRIPE_SECRET_KEY=sk_live_your_key -a the-naru-backend
heroku config:set RAZORPAY_KEY_ID=your_key -a the-naru-backend
```

**4. Deploy Backend**

```bash
cd backend
echo 'web: node src/server.js' > Procfile
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

**5. Deploy Frontend**

```bash
cd ../frontend
echo 'REACT_APP_API_URL=https://the-naru-backend.herokuapp.com/api' > .env.production
npm run build
cd build
echo '{}' > static.json
git add .
git commit -m "Build frontend for production"
git push heroku main
```

---

### Option 2: AWS Deployment (Production)

#### Architecture
```
┌─────────────────────┐
│   CloudFront CDN    │ (Frontend)
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │   S3 Bucket │ (Static Files)
    └──────┬──────┘
           │
    ┌──────▼──────────────┐
    │  Application Load   │
    │     Balancer        │
    └──────┬──────────────┘
           │
    ┌──────▼─────────────┐
    │  EC2 Instances     │ (Node.js)
    │  (Auto Scaling)    │
    └──────┬─────────────┘
           │
    ┌──────▼──────────────┐
    │  RDS PostgreSQL     │
    └─────────────────────┘
           │
    ┌──────▼──────────────┐
    │   ElastiCache      │ (Redis)
    │   (Redis)          │
    └─────────────────────┘
```

#### Steps

**1. Create RDS PostgreSQL Database**

```bash
# Via AWS Console
- Service: RDS
- Engine: PostgreSQL 13
- Multi-AZ: Yes
- Instance: db.t3.micro
- Storage: 100 GB
- Backup retention: 7 days
```

**2. Create EC2 Instance**

```bash
# Launch Instance
- Image: Ubuntu 20.04 LTS
- Instance Type: t3.medium
- Security Group: Allow ports 22, 80, 443, 5000

# Connect via SSH
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone Repository
git clone https://github.com/moviesmafiya007-rgb/The-Naru.git
cd The-Naru/backend

# Install Dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with production values

# Start Application (with PM2)
sudo npm install -g pm2
pm2 start src/server.js --name "the-naru-backend"
pm2 startup
pm2 save
```

**3. Setup Nginx Reverse Proxy**

```bash
sudo apt-get install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/the-naru
```

```nginx
upstream app {
    server localhost:5000;
}

server {
    listen 80;
    server_name api.the-naru.com;

    location / {
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/the-naru /etc/nginx/sites-enabled/

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

**4. Setup SSL with Let's Encrypt**

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.the-naru.com
```

**5. Deploy Frontend to S3 + CloudFront**

```bash
cd frontend
npm run build

# Create S3 bucket
aws s3 mb s3://the-naru-frontend

# Upload build files
aws s3 sync build/ s3://the-naru-frontend/ --delete

# Create CloudFront distribution (via AWS Console)
- Origin: S3 bucket
- Default document: index.html
- Error documents: index.html (for SPA routing)
```

---

### Option 3: DigitalOcean Deployment

#### Steps

**1. Create Droplet**

```bash
# Create $6/month Droplet
- Image: Ubuntu 20.04
- Size: Standard (1GB RAM)
- Region: Select nearest
```

**2. Setup Environment**

```bash
# Connect
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE the_naru_db;
CREATE USER naru_user WITH ENCRYPTED PASSWORD 'strong_password';
ALTER ROLE naru_user SET client_encoding TO 'utf8';
ALTER ROLE naru_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE naru_user SET default_transaction_deferrable TO on;
ALTER ROLE naru_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE the_naru_db TO naru_user;
\q
```

**3. Deploy Application**

```bash
# Clone repo
git clone https://github.com/moviesmafiya007-rgb/The-Naru.git
cd The-Naru/backend

# Install dependencies
npm install

# Setup .env
cp .env.example .env
# Edit with production values

# Run migrations
npm run migrate

# Start with PM2
npm install -g pm2
pm2 start src/server.js --name "the-naru"
pm2 startup
pm2 save
```

**4. Setup Nginx**

```bash
apt install -y nginx

# Configure Nginx (same as AWS above)
```

---

## Docker Deployment

### Create Dockerfile

```dockerfile
# File: backend/Dockerfile

FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 5000

CMD ["node", "src/server.js"]
```

```dockerfile
# File: frontend/Dockerfile

FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Production

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: naru_user
      POSTGRES_PASSWORD: strong_password
      POSTGRES_DB: the_naru_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - naru-network

  redis:
    image: redis:7
    networks:
      - naru-network

  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://naru_user:strong_password@postgres:5432/the_naru_db
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    depends_on:
      - postgres
      - redis
    networks:
      - naru-network
    restart: always

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - naru-network
    restart: always

volumes:
  postgres_data:

networks:
  naru-network:
    driver: bridge
```

### Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Environment Configuration

### Production .env

```env
# Backend
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_USER=naru_user
DB_PASSWORD=strong_password
DB_NAME=the_naru_db
DATABASE_URL=postgresql://naru_user:strong_password@your-rds-endpoint:5432/the_naru_db

# JWT
JWT_SECRET=use-very-strong-random-key
JWT_EXPIRE=7d

# Redis
REDIS_HOST=elasticache-endpoint.amazonaws.com
REDIS_PORT=6379

# Payment
STRIPE_SECRET_KEY=sk_live_actual_key
STRIPE_PUBLISHABLE_KEY=pk_live_actual_key
RAZORPAY_KEY_ID=actual_key
RAZORPAY_KEY_SECRET=actual_secret

# Emails
SENDGRID_API_KEY=actual_api_key
SENDGRID_FROM_EMAIL=noreply@thenaru.com

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-bucket-name

# App URLs
APP_URL=https://app.the-naru.com
API_URL=https://api.the-naru.com
```

---

## CI/CD Pipeline (GitHub Actions)

```yaml
# File: .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy Backend
        run: |
          cd backend
          npm install
          npm run migrate
          # Deploy to server

      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          # Deploy to S3/CloudFront

      - name: Run Tests
        run: npm test
```

---

## Monitoring & Logs

### Setup Application Logging

```bash
# View PM2 logs
pm2 logs the-naru-backend

# View Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Setup CloudWatch (AWS)

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i -E ./amazon-cloudwatch-agent.deb
```

---

## Backup Strategy

### Database Backup

```bash
# Automated daily backup
0 2 * * * pg_dump -U naru_user the_naru_db > /backups/backup_$(date +%Y%m%d).sql

# Upload to S3
0 3 * * * aws s3 cp /backups/ s3://the-naru-backups/ --recursive
```

---

## Performance Optimization

1. **Enable Redis Caching** for frequently accessed data
2. **CDN** for frontend static assets
3. **Database Indexing** on frequently queried columns
4. **Gzip Compression** in Nginx
5. **Image Optimization** for materials
6. **Lazy Loading** for quiz questions

---

**Last Updated**: June 29, 2026