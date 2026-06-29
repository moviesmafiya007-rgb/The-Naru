# The Naru - Competitive Exam Platform

A comprehensive educational application for competitive examinations with quizzes, helpdesk, student progress tracking, and lecture material management.

## 🎯 Features

- **Interactive Quizzes**: MCQ, timed quizzes, sectional tests, full-length exams
- **Lecture Materials**: Upload and organize study materials (PDFs, videos, notes)
- **Student Progress Tracking**: Real-time performance analytics and insights
- **Helpdesk System**: Live chat, ticket support, FAQ database
- **Admin Dashboard**: Content management, user analytics, exam creation
- **Leaderboard**: Competitive rankings and achievement badges
- **Real-time Notifications**: Quiz reminders, new materials, performance alerts

## 📋 Project Structure

```
The-Naru/
├── frontend/                 # React.js web application
├── backend/                  # Node.js/Express API server
├── database/                 # Database schemas and migrations
├── docs/                     # Documentation
├── .env.example             # Environment variables template
└── docker-compose.yml       # Docker setup
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- Git

### Setup Instructions

**1. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure database credentials in .env
npm run migrate
npm start
```

**2. Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

### Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin

## 🏗️ Tech Stack

- **Frontend**: React.js, Redux Toolkit, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: PostgreSQL, Redis (caching)
- **Storage**: AWS S3 / Local File System
- **Real-time**: Socket.io
- **Notifications**: Firebase Cloud Messaging, SendGrid

## 📚 Documentation

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Setup Guide](./docs/SETUP.md)

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization

## 📊 Core Modules

### 1. **Quiz Module**
- Create/edit/delete quizzes
- Multiple question types
- Automatic scoring
- Instant feedback

### 2. **Progress Tracking**
- Subject-wise performance
- Time analytics
- Weak area identification
- Performance trends

### 3. **Materials Management**
- Upload lectures and materials
- Organize by subjects/topics
- Version control
- Search and filter

### 4. **Helpdesk**
- Live chat support
- Ticket management
- FAQ system
- Community forum

### 5. **Analytics Dashboard**
- Student performance reports
- Engagement metrics
- Quiz statistics

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Lead Developer**: moviesmafiya007-rgb

## 📞 Support

For issues, feature requests, or questions, please create an issue on GitHub.

---

**Last Updated**: June 29, 2026