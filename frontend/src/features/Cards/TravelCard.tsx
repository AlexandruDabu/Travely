import React, { useEffect, useState } from 'react';
import { Travel } from '../../app/models/travels';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../app/hooks/useAuth';
import { User } from '../../app/models/user';

interface TravelCardProps {
    travel: Travel;
}

const TravelCard: React.FC<TravelCardProps> = ({ travel }) => {
    const {user} = useAuth();
    const navigate = useNavigate();

    return (
        <div className="max-w-5xl mx-auto my-8 px-4 relative">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden relative">
                {/* User Image */}
                <div className="absolute top-4 right-4">
                    <Link to={`/users/${travel.userId}`}>
                        <img
                            src={travel.userImageurl || '/user.png'}
                            alt="User Profile"
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        />
                    </Link>
                </div>
                {/* Left Image Section */}
                <div className="md:w-1/3 w-full h-64 md:h-auto">
                    <img
                        src="./image5.jpg"
                        alt="Travel"
                        className="object-cover w-full h-full"
                    />
                </div>
                {/* Right Content Section */}
                <div className="md:w-2/3 w-full p-6 flex flex-col justify-between">
                    {/* Title */}
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">{travel.title}</h2>
                    </div>
                    {/* Travel Destination */}
                    <div className="mb-4">
                        <p className="text-gray-600">
                            Destination: {travel.destination}
                        </p>
                    </div>
                    {/* Travel Description */}
                    <div className="mb-4">
                        <p className="text-gray-600">
                            {travel.notes}
                        </p>
                    </div>
                    {/* Budget */}
                    <div className="mb-4">
                        <span className="text-gray-500 font-medium">Budget: ${travel.totalBudget}</span>
                    </div>
                    {travel.userId == user?.id &&
                    <div>
                        <span className="text-green-500 font-medium">My Travel</span>
                    </div>}
                    {/* View Travel Button */}
                    <div className="flex justify-end">
                        <button 
                            onClick={() => navigate(`/travels/${travel.id}`)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-700 transition"
                        >
                            View Travel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TravelCard;
