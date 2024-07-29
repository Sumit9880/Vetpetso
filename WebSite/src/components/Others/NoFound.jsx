import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-9xl font-extrabold text-primary mb-4">404</h1>
            <p className="text-2xl font-semibold mb-8">Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" className="px-4 py-2 bg-primary text-white text-lg font-medium rounded hover:bg-secondary">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
