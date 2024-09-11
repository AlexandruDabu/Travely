import React, { useEffect, useState } from 'react';
import useAuth from '../../../app/hooks/useAuth';
import LoadingSpinner from '../../../app/layout/LoadingSpinner';
import axiosClient from '../../../app/services/axiosClient';
import FollowerCard from '../../Cards/FollowCard';
import { Link, useLocation } from 'react-router-dom';

interface Follower {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageurl: string;
    bio: string;
}

export default function Follow() {
    const { user, loading } = useAuth();
    const [followers, setFollowers] = useState<Follower[] | null>(null);
    const [followings, setFollowings] = useState<Follower[] | null>(null);
    const [loadingFollowers, setLoading] = useState<boolean>(true);
    const location = useLocation();

    useEffect(() => {
        const loadData = async () => {
            try {
                const followersData = await axiosClient(`/followers`, { withCredentials: true });
                const followingsData = await axiosClient(`/followings`, { withCredentials: true });
                setFollowers(followersData.data.data);
                setFollowings(followingsData.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user?.id]);
    if (loading || loadingFollowers) {
        return <LoadingSpinner />;
    }
    if(location.pathname==`/profiles/followings`){
        if(followings?.length === 0) {
            return (
                <div className="flex flex-wrap justify-center items-center h-screen bg-gray-100 p-6">
                    <div className="text-center bg-white shadow-lg rounded-lg p-8">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-4">No Followings Yet</h1>
                        <p className="text-gray-600 mb-6">You are not following anybody, be more friendly and add some people!</p>
                        <Link to='/travels' className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors duration-300">
                            Explore People
                        </Link>
                    </div>
                </div>
            )
        }
        

        return (
                <div className="flex flex-wrap justify-center lg:justify-start items-start bg-gray-100 p-4 gap-4">
                    {followings?.map((following) => (
                        <FollowerCard key={following.id} follower={following} />
                    ))}
                </div>
        )
    }
    if(location.pathname==`/profiles/followers`){
        if(followers?.length === 0) {
            return (
                <div className="flex flex-wrap justify-center items-center bg-gray-100 p-6">
                    <div className="text-center bg-white shadow-lg rounded-lg p-8">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-4">No Followers Yet</h1>
                        <p className="text-gray-600 mb-6">Nobody is following you at this moment. Don't worry, keep engaging and they'll come!</p>
                        <Link to={`/profiles/${user?.email}`} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300">
                            Share Your Profile
                        </Link>
                    </div>
                </div>
            )
        }
        
        return (
                <div className="flex flex-wrap justify-center lg:justify-start items-start bg-gray-100 p-4 gap-4">
                    {followers?.map((follower) => (
                        <FollowerCard key={follower.id} follower={follower} />
                    ))}
                </div>
        )
    }

    
}
