const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { Pool } = require('pg');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✓ Database connected successfully');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password, first_name, last_name, role } = req.body;
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (email, username, password_hash, first_name, last_name, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, email, username, first_name, last_name, role`,
      [email, username, password_hash, first_name, last_name, role || 'student']
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Create free trial subscription
    await pool.query(
      `INSERT INTO user_subscriptions (user_id, plan_id, status, subscription_start_date, subscription_end_date, created_at, updated_at)
       VALUES ($1, 1, 'active', NOW(), NOW() + INTERVAL '30 days', NOW(), NOW())`,
      [user.id]
    );

    // Create student progress record
    await pool.query(
      `INSERT INTO student_progress (user_id, created_at, updated_at) VALUES ($1, NOW(), NOW())`,
      [user.id]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Update last login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Quiz Routes
app.get('/api/quizzes', async (req, res) => {
  try {
    const { page = 1, limit = 10, subject_id } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM quizzes WHERE is_published = true';
    let params = [];

    if (subject_id) {
      query += ' AND subject_id = $1';
      params.push(subject_id);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: { page, limit, total: result.rows.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/quizzes/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;

    // Get quiz
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [quizId]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }

    const quiz = quizResult.rows[0];

    // Get questions
    const questionsResult = await pool.query(
      'SELECT * FROM questions WHERE quiz_id = $1 ORDER BY question_order',
      [quizId]
    );

    quiz.questions = questionsResult.rows;

    res.json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Materials Routes
app.get('/api/materials', async (req, res) => {
  try {
    const { page = 1, limit = 10, subject_id } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM materials WHERE is_published = true';
    let params = [];

    if (subject_id) {
      query += ' AND subject_id = $1';
      params.push(subject_id);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: { page, limit },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Subjects Routes
app.get('/api/subjects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subjects ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Subscription Plans Routes
app.get('/api/subscriptions/plans', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM subscription_plans WHERE is_active = true ORDER BY display_order'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Protected route example
app.get('/api/users/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, first_name, last_name, phone_number, city, state, country, profile_picture_url, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user progress
app.get('/api/users/progress', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sp.*, 
              (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1 AND status = 'graded') as total_quizzes_attempted,
              (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1 AND percentage >= 40 AND status = 'graded') as total_quizzes_passed,
              (SELECT AVG(percentage) FROM quiz_attempts WHERE user_id = $1 AND status = 'graded') as average_score
       FROM student_progress sp WHERE sp.user_id = $1`,
      [req.user.id]
    );

    const progress = result.rows[0];

    // Get subject-wise performance
    const subjectResult = await pool.query(
      `SELECT s.id, s.name, 
              COUNT(DISTINCT q.id) as quizzes_attempted,
              AVG(CASE WHEN qa.is_correct THEN 1 ELSE 0 END * 100) as average_score
       FROM subjects s
       LEFT JOIN quizzes q ON s.id = q.subject_id
       LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.user_id = $1
       GROUP BY s.id, s.name`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        ...progress,
        subject_performance: subjectResult.rows,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 The Naru Platform - Competitive Exam Preparation`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;