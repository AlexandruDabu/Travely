import React, { useState } from 'react';
import { Travel } from '../../../app/models/travels';
import { useNavigate } from 'react-router-dom';
import useTravel from '../../../app/hooks/useTravels';

interface TravelCardProps {
  travel: Travel;
}

const UserTravelCard: React.FC<TravelCardProps> = ({ travel }) => {
  const [isShared, setIsShared] = useState(travel?.isShared);
  const { deleteTravel, shareTravel } = useTravel();
  const navigate = useNavigate();

  const handleShareAction = async () => {
    try {
      await shareTravel(travel?.id);
      setIsShared(!isShared);
    } catch (err) {
      console.error(`Error sharing the travel`);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Image Section */}
        <div className="w-full sm:w-1/3">
          <img
            src='../image5.jpg'
            alt="Travel"
            className="object-cover w-full h-48 sm:h-60 lg:h-full lg:min-h-[260px]"
          />
        </div>
        {/* Right Content Section */}
        <div className="w-full sm:w-2/3 p-6 flex flex-col justify-between">
          {/* Title */}
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
              {travel?.title}
            </h2>
          </div>
          {/* Destination */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Destination: {travel?.destination}
            </p>
          </div>
          {/* Description */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm sm:text-base">
              {travel?.notes}
            </p>
          </div>
          {/* Budget */}
          <div className="mb-4">
            <span className="text-gray-500 font-medium">
              Budget: ${travel?.totalBudget}
            </span>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate(`/travels/${travel?.id}`)}
              className="px-4 py-2 border border-sky-600 text-sky-600 text-sm font-medium rounded-md hover:bg-sky-50 focus:outline-none focus:bg-sky-100"
            >
              Details
            </button>
            <button
              onClick={() => navigate(`/profiles/${travel?.id}/edit`)}
              className="px-4 py-2 border border-green-600 text-green-600 text-sm font-medium rounded-md hover:bg-green-50 focus:outline-none focus:bg-green-100"
            >
              Edit Travel
            </button>
            <button
              onClick={handleShareAction}
              className="px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 focus:outline-none focus:bg-blue-100"
            >
              {isShared ? 'Remove Share' : 'Share'}
            </button>
            <button
              onClick={() => deleteTravel(travel?.id)}
              className="px-4 py-2 border border-red-600 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 focus:outline-none focus:bg-red-100"
            >
              Delete Travel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTravelCard;
