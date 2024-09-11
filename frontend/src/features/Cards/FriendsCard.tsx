import React from 'react'
import { User } from '../../app/models/user'
import { truncateName } from '../../app/services/truncation';

interface FriendsProps {
  user: User;
  handleUserClick: (user: User) => void;
}

export default function FriendsCard({
  user,
  handleUserClick,
}: FriendsProps) {
  return (
    <div
      key={user.id}
      className="flex flex-col p-2 hover:bg-gray-700 rounded-md cursor-pointer transition duration-150 ease-in-out"
      onClick={() => handleUserClick(user)}
    >
      <div className="flex items-center space-x-2">
        <img
          src={user.imageurl ? user.imageurl : './user.png' && '../user.png'}
          alt={user.firstName}
          className="w-8 h-8 rounded-full object-cover" // Slimmed down size
        />
        <div className="flex-1 min-w-0">
          {/* Truncate names using the function */}
          <p className="text-sm text-white font-medium truncate">
            {truncateName(`${user.firstName} ${user.lastName}`, 15)}
          </p>
          <p
            className={`text-xs ${
              user.status === 'online' ? 'text-green-500' : 'text-gray-500'
            }`}
          >
            {user.status}
          </p>
        </div>
      </div>
      {/* Underline */}
      <div className="w-3/4 border-b border-gray-600 mx-auto mt-2"></div>
    </div>
  )
}
