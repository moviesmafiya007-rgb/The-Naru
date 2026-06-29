import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(userResponse.data.data);

        const progressResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProgress(progressResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, {user?.first_name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Continue your exam preparation journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm font-medium">Quizzes Attempted</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {progress?.total_quizzes_attempted || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-medium">Quizzes Passed</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {progress?.total_quizzes_passed || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm font-medium">Average Score</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {progress?.average_score?.toFixed(1) || '0'}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
            <p className="text-gray-600 text-sm font-medium">Study Time</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {Math.floor((progress?.total_study_time_minutes || 0) / 60)}h
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <a
            href="/quizzes"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold mb-2">📝 Take a Quiz</h3>
            <p>Test your knowledge on various subjects</p>
          </a>
          <a
            href="/materials"
            className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8 hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold mb-2">📚 Study Materials</h3>
            <p>Access lectures, notes, and videos</p>
          </a>
          <a
            href="/progress"
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-8 hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold mb-2">📊 Your Progress</h3>
            <p>View detailed analytics and performance</p>
          </a>
          <a
            href="/subscription"
            className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg p-8 hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold mb-2">⭐ Upgrade Plan</h3>
            <p>Get premium features and exclusive content</p>
          </a>
        </div>

        {/* Subject Performance */}
        {progress?.subject_performance && progress.subject_performance.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Subject-wise Performance</h2>
            <div className="space-y-3">
              {progress.subject_performance.map((subject, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{subject.subject_name}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(subject.average_score || 0, 100)}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600 w-12">
                      {subject.average_score?.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;