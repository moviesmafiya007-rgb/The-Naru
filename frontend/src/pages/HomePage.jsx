import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-white">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">The Naru</h1>
          <p className="text-2xl md:text-3xl mb-8 opacity-90">Master Your Competitive Exams</p>
          <p className="text-lg opacity-75 max-w-2xl mx-auto mb-12">
            Complete platform for exam preparation with interactive quizzes, study materials,
            progress tracking, and expert support.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Get Started Free
            </a>
            <a
              href="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition"
            >
              Login
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Why Choose The Naru?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📝',
                title: 'Interactive Quizzes',
                description: 'Test your knowledge with expertly crafted quizzes across 8 subjects',
              },
              {
                icon: '📚',
                title: 'Study Materials',
                description: 'Access comprehensive lectures, notes, and video tutorials',
              },
              {
                icon: '📊',
                title: 'Progress Tracking',
                description: 'Get detailed analytics and personalized recommendations',
              },
              {
                icon: '💬',
                title: 'Expert Support',
                description: 'Get help from experienced mentors through helpdesk',
              },
              {
                icon: '🎯',
                title: '8 Subjects',
                description: 'Prepare for competitive exams across all major subjects',
              },
              {
                icon: '⭐',
                title: 'Flexible Plans',
                description: 'Choose from free or premium subscription plans',
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 border rounded-lg hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50K+', label: 'Active Students' },
              { number: '1000+', label: 'Quality Quizzes' },
              { number: '500+', label: 'Study Materials' },
              { number: '95%', label: 'Success Rate' },
            ].map((stat, idx) => (
              <div key={idx}>
                <p className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg opacity-90 mb-8">Join thousands of students preparing for competitive exams</p>
          <a
            href="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-block"
          >
            Register Now - It's Free!
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;