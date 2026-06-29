# 1. Project Setup Guide

## Complete Setup Instructions for The Naru Platform

### Prerequisites
- **Node.js** v14+ ([Download](https://nodejs.org))
- **PostgreSQL** v12+ ([Download](https://www.postgresql.org/download))
- **Git** ([Download](https://git-scm.com))
- **Redis** (optional, for caching) ([Download](https://redis.io))
- **npm** or **yarn** package manager
- **Stripe/Razorpay Account** (for payments)

---

## Step 1: Clone Repository

```bash
git clone https://github.com/moviesmafiya007-rgb/The-Naru.git
cd The-Naru
```

---

## Step 2: Backend Setup

### 2.1 Create Backend Directory Structure

```bash
mkdir backend
cd backend
npm init -y
```

### 2.2 Install Backend Dependencies

```bash
npm install express cors dotenv bcryptjs jsonwebtoken postgres pg
npm install socket.io multer aws-sdk nodemailer uuid
npm install stripe razorpay axios
npm install --save-dev nodemon
```

### 2.3 Configure Environment Variables

```bash
cp ../.env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=the_naru_db

JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

REDIS_HOST=localhost
REDIS_PORT=6379

AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name

SENDGRID_API_KEY=your_sendgrid_api_key

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Webhook URLs
STRIPE_WEBHOOK_SECRET=whsec_test_key
```

### 2.4 Create Backend Project Structure

```bash
mkdir -p src/{models,controllers,routes,middleware,config,utils}
touch src/server.js
```

### 2.5 Update package.json Scripts

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "migrate": "node src/database/migrate.js"
  }
}
```

### 2.6 Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE the_naru_db;

# Exit
\q
```

---

## Step 3: Frontend Setup

### 3.1 Create React Application

```bash
cd ..
npx create-react-app frontend
cd frontend
```

### 3.2 Install Frontend Dependencies

```bash
npm install react-router-dom redux @reduxjs/toolkit axios
npm install tailwindcss postcss autoprefixer
npm install chart.js react-chartjs-2 recharts
npm install socket.io-client
npm install react-toastify react-loader-spinner
npm install date-fns
npm install @stripe/react-stripe-js @stripe/js
```

### 3.3 Configure Tailwind CSS

```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3.4 Create Frontend Structure

```bash
mkdir -p src/{components,pages,redux,utils,services,hooks,styles}
```

### 3.5 Configure Environment

```bash
cp ../.env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WEBSOCKET_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

---

## Step 4: Database Setup

### 4.1 Run Migrations

```bash
cd backend
npm run migrate
```

### 4.2 Seed Sample Data (Optional)

```bash
node src/database/seed.js
```

---

## Step 5: Start Development Servers

### Terminal 1: Start Backend

```bash
cd backend
npm run dev
# Output: Server running on http://localhost:5000
```

### Terminal 2: Start Frontend

```bash
cd frontend
npm start
# Output: App running on http://localhost:3000
```

### Terminal 3 (Optional): Start Redis

```bash
redis-server
```

---

## Step 6: Verify Setup

### Check Backend API

```bash
curl http://localhost:5000/api/health
# Expected: {"status": "OK"}
```

### Check Frontend

Open browser: `http://localhost:3000`

---

## Docker Setup (Alternative)

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: the_naru_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/the_naru_db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Run with Docker

```bash
docker-compose up -d
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process on port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart
```

### Node Modules Issues

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. ✅ Review [Database Schema](./2_DATABASE_SCHEMA.md)
2. ✅ Check [API Documentation](./3_API_DOCUMENTATION.md)
3. ✅ Read [Frontend Components Guide](./4_FRONTEND_COMPONENTS.md)
4. ✅ Explore [Deployment Guide](./5_DEPLOYMENT.md)
5. ✅ Review [Payment Integration Guide](./PAYMENT_INTEGRATION.md)

---

**Last Updated**: June 29, 2026