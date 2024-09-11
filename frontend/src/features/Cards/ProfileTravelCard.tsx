import React from 'react';
import { Travel } from '../../app/models/travels';

interface TravelMiniCardProps {
    travel: Travel;
}

const ProfileTravelCard: React.FC<TravelMiniCardProps> = ({ travel }) => {
    return (
        <div className="border border-gray-200 shadow-lg rounded-lg p-5 mb-4 transition-transform transform hover:scale-105 hover:shadow-xl">
            {/* Travel Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{travel.title}</h3>
            
            {/* Travel Destination */}
            <div className="flex items-center mb-2">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    Destination
                </span>
                <p className="text-gray-700">{travel.destination}</p>
            </div>
            
            {/* Travel Budget */}
            <div className="flex items-center">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    Budget
                </span>
                <p className="text-gray-700">${travel.totalBudget}</p>
            </div>
        </div>
    );
};

export default ProfileTravelCard;
