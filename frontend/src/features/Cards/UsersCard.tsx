import React from 'react';
import { useNavigate } from 'react-router-dom';
import {truncateBio, truncateName} from '../../app/services/truncation';

interface UserCardProps {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        imageurl?: string;
        bio?: string;
        country?: string;
        city?: string;
        travelsNumber:string;
    };
}

const  UsersCard: React.FC<UserCardProps> = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto my-4 px-4 relative">
            <div className="flex bg-white shadow-lg rounded-lg overflow-hidden relative">
                {/* User Image on Left */}
                <div className="flex-shrink-0 flex items-center justify-center p-2">
                    <img
                        src={user.imageurl || '/user.png'}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-16 h-16 rounded-full m-4"
                    />
                </div>

                {/* Right Content Section */}
                <div className="flex flex-col justify-between p-4 flex-grow">
                    {/* Top Section */}
                    <div>
                        {/* User Name */}
                        <div className="mb-2">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {truncateName(user.firstName + ' ' + user.lastName, 26)}
                            </h2>
                        </div>
                        {/* User Bio */}
                        <div className="mb-2">
                            <p className="text-gray-600 text-sm">
                                {truncateBio(user.bio || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis. In condimentum facilisis porta. Sed nec diam eu diam mattis viverra. Nulla fringilla, orci ac euismod semper, magna diam porttitor.')}
                            </p>
                        </div>
                        {/* User Email */}
                        <div className="mb-2">
                            <p className="text-gray-600 text-sm">
                                Travels: {user.travelsNumber ? user.travelsNumber : '0'}
                            </p>
                        </div>
                        {/* User Location */}
                        <div className="mb-2">
                            <p className="text-gray-600 text-sm">
                                {user.city && user.country ? `From: ${user.city}, ${user.country}` : `From: ${user.country || 'Unknown location'}`}
                            </p>
                        </div>
                    </div>
                    {/* Buttons Section */}
                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={() => navigate(`/users/${user.id}`)}
                            className="px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-700 transition"
                        >
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsersCard;
