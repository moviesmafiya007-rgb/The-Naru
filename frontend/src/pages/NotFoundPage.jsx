import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-6">Page Not Found</p>
        <p className="text-lg opacity-75 mb-8">The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-block"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;