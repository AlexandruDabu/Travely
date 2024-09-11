import React from 'react';
import { Link } from 'react-router-dom';
import { truncateName } from '../../app/services/truncation';

interface FollowerCardProps {
    follower: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        imageurl: string;
        bio: string;
    };
}

const FollowerCard: React.FC<FollowerCardProps> = ({ follower }) => {
    return (
        <Link to={`/users/${follower.id}`} className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out p-5 flex items-center space-x-4 w-96">
                <img
                    src={follower.imageurl || '/user.png'}
                    alt={`${follower.firstName} ${follower.lastName}`}
                    className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover"
                />
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                        {truncateName(follower.firstName + ' ' + follower.lastName, 26)}
                    </h2>
                    <p className="text-gray-500 truncate">{follower.email}</p>
                    <p className="mt-2 text-gray-700 text-sm line-clamp-2">
                        {follower.bio || "No bio available"}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default FollowerCard;
