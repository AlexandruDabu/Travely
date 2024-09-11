import React from 'react'
import TravelCard from '../Cards/TravelCard'
import useTravel from '../../app/hooks/useTravels'
import { Travel } from '../../app/models/travels';
import useAuth from '../../app/hooks/useAuth';
import LoadingSpinner from '../../app/layout/LoadingSpinner';
import { Link, useSearchParams } from 'react-router-dom';

export default function Travels() {
    const [searchParams] = useSearchParams();
    const {AllSharedTravels, AllSearchTravels,loadingSearch, loadingTravels} = useTravel();
    const {loading} = useAuth();
    if(AllSharedTravels===null || loadingTravels || loading){
        return (
            <LoadingSpinner/>
        )
    }
    if(AllSharedTravels.length==0)
      return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          There are no shared travels, be the first one to share one!
        </h1>
        <Link to ='/profiles/travels' className="px-6 py-2 mt-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Share a Travel
        </Link>
      </div>
    ) 
    if(!searchParams.size)
  return (
    <div>
        {AllSharedTravels.map((travel:Travel) => (
            <TravelCard key={travel.id}travel={travel}/>
        ))}
    </div> 
  )
  if(AllSearchTravels == null || loadingSearch){
    return (
        <LoadingSpinner/>
    )
  }
    return (
    <div>
        {AllSearchTravels.map((travel:Travel) => (
            <TravelCard key={travel.id}travel={travel}/>
        ))}
    </div> 
    )
}
