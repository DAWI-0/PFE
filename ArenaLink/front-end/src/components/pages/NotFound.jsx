import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="mt-2 text-lg text-gray-700">Page not found</p>
    </div>
  );
};

export default NotFound;