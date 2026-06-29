# 4. Frontend Components & Structure Guide

## Complete React.js Component Architecture for The Naru Platform

---

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── Quiz/
│   │   │   ├── QuizList.jsx
│   │   │   ├── QuizDetail.jsx
│   │   │   ├── QuizAttempt.jsx
│   │   │   ├── QuizResults.jsx
│   │   │   └── QuestionDisplay.jsx
│   │   ├── Materials/
│   │   │   ├── MaterialLibrary.jsx
│   │   │   ├── MaterialUpload.jsx
│   │   │   ├── MaterialViewer.jsx
│   │   │   └── MaterialDownload.jsx
│   │   ├── Progress/
│   │   │   ├── ProgressDashboard.jsx
│   │   │   ├── PerformanceChart.jsx
│   │   │   ├── SubjectWiseAnalysis.jsx
│   │   │   └── WeakAreaAnalysis.jsx
│   │   ├── Helpdesk/
│   │   │   ├── TicketList.jsx
│   │   │   ├── TicketCreate.jsx
│   │   │   ├── TicketDetail.jsx
│   │   │   ├── LiveChat.jsx
│   │   │   └── FAQSection.jsx
│   │   ├── Subscription/
│   │   │   ├── PlansList.jsx
│   │   │   ├── PaymentForm.jsx
│   │   │   ├── SubscriptionStatus.jsx
│   │   │   ├── InvoiceHistory.jsx
│   │   │   └── PromoCodeInput.jsx
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── QuizManagement.jsx
│   │   │   ├── AnalyticsBoard.jsx
│   │   │   └── RevenueAnalytics.jsx
│   │   ├── Shared/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── Common/
│   │       ├── Card.jsx
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       └── Toast.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── QuizzesPage.jsx
│   │   ├── MaterialsPage.jsx
│   │   ├── ProgressPage.jsx
│   │   ├── HelpdeskPage.jsx
│   │   ├── SubscriptionPage.jsx
│   │   ├── AdminPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── ProfilePage.jsx
│   ├── redux/
│   │   ├── store.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── quizSlice.js
│   │   │   ├── progressSlice.js
│   │   │   ├── subscriptionSlice.js
│   │   │   ├── notificationSlice.js
│   │   │   └── uiSlice.js
│   │   └── thunks/
│   │       ├── authThunks.js
│   │       ├── quizThunks.js
│   │       ├── subscriptionThunks.js
│   │       └── paymentThunks.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── quizService.js
│   │   ├── materialService.js
│   │   ├── progressService.js
│   │   ├── subscriptionService.js
│   │   ├── helpdeskService.js
│   │   └── paymentService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useQuiz.js
│   │   ├── useProgress.js
│   │   ├── useSubscription.js
│   │   ├── useFetch.js
│   │   └── useNotification.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── variables.css
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── localStorage.js
│   ├── App.jsx
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

---

## Key Components Implementation

### 1. Authentication Components

```javascript
// File: frontend/src/components/Auth/LoginForm.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/thunks/authThunks';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await dispatch(loginUser({ email, password }));
      if (result.payload) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center mt-4 text-sm">
        Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
      </p>
    </form>
  );
};

export default LoginForm;
```

### 2. Quiz Components

```javascript
// File: frontend/src/components/Quiz/QuizAttempt.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/quizzes/${quizId}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setQuiz(response.data.data);
      setTimeLeft(response.data.data.time_limit_minutes * 60);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/quizzes/${quizId}/submit`,
        { answers: Object.entries(answers).map(([qId, ans]) => ({ question_id: qId, user_answer: ans })) },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setSubmitted(true);
      localStorage.setItem('quizResult', JSON.stringify(response.data.data));
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (!quiz) return <div>Loading...</div>;

  const question = quiz.questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h2>{quiz.title}</h2>
        <div className="text-lg font-bold">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {!submitted ? (
        <>
          <div className="mb-6 bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-600 mb-2">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </p>
            <h3 className="text-lg font-bold mb-4">{question.question_text}</h3>

            <div className="space-y-3">
              {['option_a', 'option_b', 'option_c', 'option_d'].map((option, idx) => (
                <label key={idx} className="flex items-center p-3 border rounded hover:bg-blue-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={['A', 'B', 'C', 'D'][idx]}
                    checked={answers[question.id] === ['A', 'B', 'C', 'D'][idx]}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="mr-3"
                  />
                  <span>{question[option]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Quiz Submitted!</h3>
          <p>Your results are being processed. Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default QuizAttempt;
```

### 3. Progress Dashboard

```javascript
// File: frontend/src/components/Progress/ProgressDashboard.jsx

import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';

const ProgressDashboard = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/progress`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading progress...</div>;

  const weeklyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Daily Score',
      data: [75, 80, 78, 85, 88, 82, 90],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  const subjectChartData = {
    labels: progress.subject_performance.map(s => s.subject_name),
    datasets: [{
      label: 'Average Score by Subject',
      data: progress.subject_performance.map(s => s.average_score),
      backgroundColor: [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
        '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'
      ]
    }]
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Your Progress Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Quizzes Attempted</p>
          <p className="text-3xl font-bold">{progress.total_quizzes_attempted}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Quizzes Passed</p>
          <p className="text-3xl font-bold">{progress.total_quizzes_passed}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Average Score</p>
          <p className="text-3xl font-bold">{progress.average_score}%</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Study Time</p>
          <p className="text-3xl font-bold">{Math.floor(progress.total_study_time_minutes / 60)}h</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Weekly Performance</h3>
          <Line data={weeklyChartData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Subject-wise Performance</h3>
          <Bar data={subjectChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
```

### 4. Subscription Management

```javascript
// File: frontend/src/components/Subscription/PlansList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PaymentButton from './PaymentButton';

const PlansList = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/subscriptions/plans`
      );
      setPlans(response.data.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/subscriptions/current`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setCurrentPlan(response.data.data);
    } catch (error) {
      console.log('No active subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>

      {currentPlan && (
        <div className="mb-8 bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Current Plan:</p>
          <p className="text-lg font-bold">{currentPlan.plan.name}</p>
          <p className="text-sm">Expires: {new Date(currentPlan.subscription_end_date).toLocaleDateString()}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border-2 rounded-lg p-6 transition ${
              currentPlan?.plan.id === plan.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

            <div className="text-3xl font-bold mb-2">
              ₹{plan.price}
              <span className="text-sm text-gray-600">/{plan.billing_cycle}</span>
            </div>

            <ul className="mb-6 space-y-2 text-sm">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {currentPlan?.plan.id === plan.id ? (
              <button className="w-full bg-gray-400 text-white py-2 rounded" disabled>
                Current Plan
              </button>
            ) : (
              <PaymentButton planId={plan.id} planPrice={plan.price} planName={plan.name} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansList;
```

---

## Redux Store Setup

```javascript
// File: frontend/src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import quizReducer from './slices/quizSlice';
import progressReducer from './slices/progressSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    progress: progressReducer,
    subscription: subscriptionReducer,
    ui: uiReducer
  }
});

export default store;
```

```javascript
// File: frontend/src/redux/slices/authSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser } from '../thunks/authThunks';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    });
  }
});

export default authSlice.reducer;
```

---

## API Service

```javascript
// File: frontend/src/services/api.js

import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Add token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
```

---

## Custom Hooks

```javascript
// File: frontend/src/hooks/useAuth.js

import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../redux/thunks/authThunks';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginUser(credentials));
  const logout = () => dispatch(logoutUser());
  const isAuthenticated = !!token;

  return { user, token, loading, error, login, logout, isAuthenticated };
};
```

---

## Main App Component

```javascript
// File: frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import QuizzesPage from './pages/QuizzesPage';
import MaterialsPage from './pages/MaterialsPage';
import ProgressPage from './pages/ProgressPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/quizzes" element={<QuizzesPage />} />
                <Route path="/materials" element={<MaterialsPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
```

---

**Last Updated**: June 29, 2026