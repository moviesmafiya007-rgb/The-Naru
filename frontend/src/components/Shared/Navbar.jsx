import React from 'react';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold">The Naru</a>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <a href="/dashboard" className="hover:text-blue-100 transition">Dashboard</a>
              <a href="/quizzes" className="hover:text-blue-100 transition">Quizzes</a>
              <a href="/materials" className="hover:text-blue-100 transition">Materials</a>
              <a href="/progress" className="hover:text-blue-100 transition">Progress</a>
              <a href="/subscription" className="hover:text-blue-100 transition">Subscription</a>
              <div className="flex items-center gap-3 border-l pl-6">
                <span className="text-sm">{user.first_name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <a href="/login" className="hover:text-blue-100 transition">Login</a>
              <a href="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition font-medium">
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;