import React from 'react';
import { Link } from 'react-router-dom';

export default function SessionExpired() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Session Expired</h1>
        <p className="text-gray-600 mb-6">Your session has expired. Please log in again to continue.</p>
        <Link to = '/login'
          className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Go back to login
        </Link>
      </div>
    </div>
  );
}
