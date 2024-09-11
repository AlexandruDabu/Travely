import React, { useEffect, useState } from 'react';
import useTravel from '../../../app/hooks/useTravels';
import UserTravelCard from './UserTravelCard';
import { Travel } from '../../../app/models/travels';
import { Link } from 'react-router-dom';

enum FilterOptions {
  CURRENT = 'current',
  FUTURE = 'future',
  PAST = 'past',
}

export default function MyTravels() {
  const { AllUserTravels } = useTravel();
  const [filter, setFilter] = useState<FilterOptions>(FilterOptions.CURRENT);
  const [filteredTravels, setFilteredTravels] = useState<Travel[]>()
  useEffect(() => {
        const currentDate = new Date()
        const filtered = AllUserTravels?.filter(travel => {
        const endDate = new Date(travel.endDate);
        const startDate = new Date(travel.startDate);
        if(filter==='current'){
          return endDate >= currentDate && startDate <= currentDate;
        }
        if(filter==='future'){
          return startDate > currentDate;
        }
        if(filter==='past'){
          return endDate < currentDate;
        }
        })
        setFilteredTravels(filtered)
},[filter])
  return (
    <div className="flex flex-col items-stretch h-screen bg-gray-100 p-4">
      {/* Filter Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setFilter(FilterOptions.CURRENT)}
          className={`px-4 py-2 rounded-md focus:outline-none ${filter === FilterOptions.CURRENT ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800 border border-gray-300'}`}
        >
          Current
        </button>
        <button
          onClick={() => setFilter(FilterOptions.FUTURE)}
          className={`px-4 py-2 rounded-md focus:outline-none ${filter === FilterOptions.FUTURE ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800 border border-gray-300'}`}
        >
          Future
        </button>
        <button
          onClick={() => setFilter(FilterOptions.PAST)}
          className={`px-4 py-2 rounded-md focus:outline-none ${filter === FilterOptions.PAST ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800 border border-gray-300'}`}
        >
          Past
        </button>
      </div>
      <div className="container mx-auto p-4">
        {/* Current Travels */}
        {filter === 'current' && filteredTravels?.length === 0 || filteredTravels === undefined ? (
          <div className="text-center bg-gray-100 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">You are currently not traveling!</h1>
            <p className="mb-6">You should think about taking a break and go somewhere. Check out some places:</p>
            <Link to='/travels' className="bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-600">
              Check Places
            </Link>
          </div>
        ) : filter === 'current' && filteredTravels?.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {filteredTravels?.map((travel) => (
              <UserTravelCard key={travel.id} travel={travel} />
            ))}
          </div>
        ) : null}

        {/* Future or Past Travels */}
        {(filter !== 'current') && (filteredTravels?.length === 0 || filteredTravels === undefined) ? (
          <div className="text-center bg-gray-100 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">No travels planned?</h1>
            <p className="mb-6">Maybe you should create a new travel plan:</p>
            <Link to='/profiles/travels/create' className="bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-600">
              Create Travel
            </Link>
          </div>
        ) : (filter !== 'current') && filteredTravels!==undefined && filteredTravels?.length > 0 ? (
          <div className="flex flex-col space-y-4 mt-8">
            {filteredTravels?.map((travel) => (
              <UserTravelCard key={travel.id} travel={travel} />
            ))}
          </div>
        ) : null}
      </div>


     
    </div>
  );
}
