import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [quizzesRes, subjectsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/quizzes`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/subjects`, { headers }),
        ]);

        setQuizzes(quizzesRes.data.data);
        setSubjects(subjectsRes.data.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredQuizzes = selectedSubject
    ? quizzes.filter(q => q.subject_id === parseInt(selectedSubject))
    : quizzes;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">📝 Quizzes</h1>

        {/* Filter */}
        <div className="mb-8">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quizzes Grid */}
        {filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(quiz => (
              <div key={quiz.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{quiz.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p>📋 Questions: {quiz.total_questions}</p>
                  <p>⏱️ Time: {quiz.time_limit_minutes} minutes</p>
                  <p>
                    🎯 Difficulty:{' '}
                    <span className="capitalize font-medium">{quiz.difficulty}</span>
                  </p>
                  <p>✅ Pass Score: {quiz.passing_score}%</p>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No quizzes available for the selected subject.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;