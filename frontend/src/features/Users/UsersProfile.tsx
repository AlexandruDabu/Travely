import React, { useEffect, useState } from 'react';
import useAuth from '../../app/hooks/useAuth';
import useTravel from '../../app/hooks/useTravels';
import LoadingSpinner from '../../app/layout/LoadingSpinner';
import { User } from '../../app/models/user';
import axiosClient from '../../app/services/axiosClient';
import { Link, useParams } from 'react-router-dom';
import { Travel } from '../../app/models/travels';
import ProfileTravelCard from '../Cards/ProfileTravelCard';
import './UsersProfile.css';
import Chat from '../Chat/Chat';
import useChat from '../../app/hooks/useChat';

export default function UsersProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUser] = useState<User | null>(null);
  const [travels, setTravels] = useState<Travel[] | null>(null);
  const [followings, setFollowings] = useState<User[] | null>(null);
  const [followers, setFollowers] = useState<User[] | null>(null);
  const [isFollowings, setIsFollowing] = useState<boolean>(false);
  const {chatOpen, setChatOpen} = useChat()

  useEffect(() => {
    const loadData = async () => {
      try {
        const responseFollowers = await axiosClient.get(`/followers/${id}`, { withCredentials: true });
        const responseFollowings = await axiosClient.get(`/followings/${id}`, { withCredentials: true });
        const response_recent = await axiosClient.get(`/recentTravels/${id}`, { withCredentials: true });
        const response = await axiosClient.get(`/auth/users/${id}`, { withCredentials: true });
        setFollowings(responseFollowings.data.data);
        setFollowers(responseFollowers.data.data);
        setUser(response.data.data);
        setTravels(response_recent.data.data);
        const isUserFollowings = responseFollowers.data.data.some((follower: User) => follower.id === user?.id);
        setIsFollowing(isUserFollowings);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, user]);

  const handleFollow = async () => {
    try {
      await axiosClient.post(`/follow/${userProfile?.id}`);
      setIsFollowing(true);
      setFollowers((prev) => (prev ? [...prev, user!] : [user!]));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosClient.delete(`/unfollow/${userProfile?.id}`);
      setIsFollowing(false);
      setFollowers((prev) => prev?.filter((follower) => follower.id !== user?.id) || null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggleChat = () => {
    setChatOpen(true); // Toggle chat window visibility
  };

  if (loading) {
    return <LoadingSpinner />;
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
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture & Info */}
          <div className="col-span-1 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <label>
              <div className="relative w-32 h-32 sm:w-48 sm:h-48 lg:w-48 lg:h-48 rounded-full overflow-hidden mb-6">
                <img
                  src={userProfile?.imageurl || '/user.png'}
                  alt="Profile"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gray-100 opacity-0 transition-opacity duration-300 flex items-center justify-center"></div>
              </div>
            </label>
            <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-800">{userProfile?.firstName} {userProfile?.lastName}</h2>
            <p className="text-center text-gray-600">{userProfile?.email}</p>
            <p className={`mt-4 ${user?.bio ? 'text-gray-600' : 'text-gray-400'} text-center`}>
              {user?.bio ? user?.bio : 'A passionate about traveling with no bio just looking around'}
            </p>
          </div>

          {/* Additional Info */}
          <div className="col-span-2 bg-white shadow-md rounded-lg p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow">
              <div>
                <h3 className="text-gray-700 font-semibold">Location</h3>
                <p className="text-gray-600">{userProfile?.city}, {userProfile?.country}</p>
              </div>
              <div>
                <h3 className="text-gray-700 font-semibold">Total Travels</h3>
                <p className="text-gray-600">{userProfile?.travelsNumber || 0}</p>
              </div>
              <div>
                <h3 className="text-gray-700 font-semibold">Followers</h3>
                <p className="text-gray-600">{followers ? followers.length : '0'}</p>
              </div>
              <div>
                <h3 className="text-gray-700 font-semibold">Following</h3>
                <p className="text-gray-600">{followings ? followings.length : '0'}</p>
              </div>
            </div>

            {/* Action buttons */}
            {user?.id !== userProfile?.id && (
              <div className="mt-auto flex justify-between gap-4">
                {isFollowings ? (
                  <button onClick={handleUnfollow} className="custom-button unfollow-button">
                    <span className="button-text">Unfollow</span>
                  </button>
                ) : (
                  <button onClick={handleFollow} className="custom-button follow-button">
                    <span className="button-text">Follow</span>
                  </button>
                )}

                <button className="custom-button message-button" onClick={handleToggleChat}>
                  <span className="button-text">Message</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            {travels?.length ? (
              <div className="flex flex-wrap gap-4">
                {travels.slice(0, 6).map((travel) => (
                  <div key={travel.id} className="flex-1 min-w-[300px] max-w-[calc(33%-1rem)]">
                    <Link to={`/travels/${travel.id}`}>
                      <ProfileTravelCard travel={travel} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">This user doesn't have any recent Travel to show!</p>
            )}
          </div>
        </div>

        {/* Chat Tab */}
        {chatOpen && <Chat userId={user?.id} receiverId={id} userProfile={userProfile}/>}
      </div>
    </div>
  );
}
