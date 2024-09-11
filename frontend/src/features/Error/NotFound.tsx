import React from 'react'
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/featured/?mountains,desert,bus)' }}>
          <div className="bg-black bg-opacity-40 absolute inset-0"></div>
          <div className="relative text-center">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">404</h1>
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">Page not found</h2>
            <p className="text-white text-lg md:text-xl mb-6">Sorry, we couldn't find the page you're looking for.</p>
            <Link to="/" className="text-white text-lg font-medium underline hover:text-gray-300">
              &larr; Back to home
            </Link>
          </div>
        </div>
      );
}
