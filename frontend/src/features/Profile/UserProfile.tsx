import React, { useEffect, useState } from 'react';
import useAuth from '../../app/hooks/useAuth';
import useTravel from '../../app/hooks/useTravels';
import LoadingSpinner from '../../app/layout/LoadingSpinner';
import EditProfile from './EditProfile';
import ImageUploader from './ImageUploader';
import { User } from '../../app/models/user';
import ProfileTravelCard from '../Cards/ProfileTravelCard';
import { Link } from 'react-router-dom';
import axiosClient from '../../app/services/axiosClient';

export default function UserProfile() {
    const { user, loading } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const { AllUserTravels, loadingTravels } = useTravel();
    const [loadingFollowers, setLoadingFollowers] = useState(false);
    const [followers, setFollowers] = useState('0');
    const [followings, setFollowings] = useState('0');
    
    useEffect(() => {
        const getFollowers = async() => {
            try{
            const followingResponse = await axiosClient.get(`/followings`, {withCredentials: true})
            const followersResponse = await axiosClient.get(`/followers`, {withCredentials: true})
            setFollowings(followingResponse.data.data.length)
            setFollowers(followersResponse.data.data.length)
            }catch(err){
                console.log(err)
            }finally{
                setLoadingFollowers(false)
            }
        }
        getFollowers();
    },[user?.id])
    if (loadingTravels || loading || loadingFollowers) {
        return <LoadingSpinner />;
    }
    if(editMode){
        return (
            <EditProfile setEditMode={setEditMode} followersNumber={followers} followingsNumber={followings}/>
        )
    }
    return (
        <div className="flex flex-col lg:flex-row items-stretch h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 p-4 lg:p-8">
                {/* Header */}
                <div className="w-full bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">User Profile</h1>
                        <p className="text-gray-600">Manage your profile and activities</p>
                    </div>
                    <button onClick={() => setEditMode(true)}className="mt-4 sm:mt-0 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
                        Edit Profile
                    </button>
                </div>

                {/* Profile Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Picture & Info */}
                    <div className="col-span-1 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
                            <ImageUploader initialImageUrl={user ? user.imageurl : ''}/>   
                        <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-800">{user?.firstName} {user?.lastName}</h2>
                        <p className="text-center text-gray-600">{user?.email}</p>
                        <p className={`mt-4 ${user?.bio ? ('text-gray-600') : ('text-gray-400')} text-center`}>{user?.bio ? (user?.bio) : ('A passionate about traveling with no bio just looking around')}</p>
                    </div>

                    {/* Additional Info */}
                    <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-gray-700 font-semibold">Location</h3>
                                <p className="text-gray-600">{user?.city}, {user?.country}</p>
                            </div>
                            <div className='max-w-28'>
                                <Link to ='/profiles/travels'>
                                <h3 className="text-gray-700 font-semibold">Total Travels</h3>
                                <p className="text-gray-600">{AllUserTravels?.length}</p>
                                </Link>
                            </div>
                            <div className='max-w-20'>
                                <Link to='/profiles/followers'>
                                    <h3 className="text-gray-700 font-semibold">Followers</h3>
                                    <p className="text-gray-600">{followers}</p>
                                </Link>
                            </div>
                            <div className='max-w-20'>
                                <Link to='/profiles/followings'>
                                    <h3 className="text-gray-700 font-semibold">Following</h3>
                                    <p className="text-gray-600">{followings}</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Content Sections */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Travels</h2>
                    <div className="bg-white shadow-md rounded-lg p-10">
                        {AllUserTravels?.length ? (
                            AllUserTravels?.slice(0,6).map(travel => (
                            <Link to={`/travels/${travel.id}`}>
                            <ProfileTravelCard travel={travel}/>
                            </Link>
                        ))
                        ) :(
                            <p className="text-gray-600">This user doesn't have any Recent Travel to Share</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
