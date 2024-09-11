import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axiosClient from '../../app/services/axiosClient';
import useAuth from '../../app/hooks/useAuth';
import { User } from '../../app/models/user';
import Chat from '../Chat/Chat';
import useChat from '../../app/hooks/useChat';
import FriendsCard from '../Cards/FriendsCard';

const UsersSideBar: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingDATA, setLoadingData] = useState<boolean>(true);
  const { user, followings, loading } = useAuth();
  const { setSelectedUser, setChatOpen } = useChat();
  const [friends, setFriends] = useState<User[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setChatOpen(true);
  };

  useEffect(() => {
        const changeFriends = async () => {
        if (followings) {
            setFriends(followings.sort(() => 0.5 - Math.random()).slice(0, 5));
        } else {
            setFriends(null);
        }

        if (searchTerm && followings) {
            setFriends(
            followings
                .filter((following) => {
                const fullName = `${following.firstName} ${following.lastName}`.toLowerCase();
                return fullName.includes(searchTerm.toLowerCase());
                })
                .slice(0, 5)
            );
        }

        setFriends((prevFriends) => {
            if (prevFriends) {
            return prevFriends.slice().sort((a, b) => {
                if (a.status === 'online' && b.status !== 'online') return -1;
                if (a.status !== 'online' && b.status === 'online') return 1;
                return 0;
            });
            }
            return prevFriends; // return the previous state if it's null or undefined
        });
    };
    if(!loading)
    changeFriends();
  }, [searchTerm]);

  useEffect(() => {
    const closeToMe = {
      country: user?.country,
      city: user?.city,
    };
    const loadData = async () => {
      try {
        const userData = await axiosClient.get(`/auth/randomUsers`, {
          params: closeToMe,
        });
        setUsers(userData.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="w-60 bg-gray-800 shadow-md h-screen p-4">
      <h2 className="text-lg text-white font-semibold mb-4">Friends</h2>
      <div className="space-y-3">
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type here"
          className="w-full px-3 py-1.5 border border-gray-600 rounded-md shadow-sm bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 placeholder-gray-500"
        />
        {friends ? (
          friends.map((user) => <FriendsCard user={user} handleUserClick={handleUserClick} />)
        ) : (
          <p className="text-white">Get some friends maybe?</p>
        )}
      </div>
      <h2 className="text-lg text-white font-semibold mb-4">Suggestions</h2>
      <div className="space-y-3">
        {users.map((user) => (
          <FriendsCard user={user} handleUserClick={handleUserClick} />
        ))}
      </div>
    </div>
  );
};

  
const Layout: React.FC = () => {
    const { selectedUser, chatOpen } = useChat();
    const { user } = useAuth();
  
    return (
      <div className="relative flex h-screen">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
  
        {/* Chat Component */}
        {chatOpen && selectedUser && (
          <Chat userId={user?.id} receiverId={selectedUser.id} userProfile={selectedUser} />
        )}
  
        {/* Users Sidebar (will disappear on smaller screens) */}
        <div className="hidden md:block w-60 h-full bg-gray-800 shadow-md">
          <UsersSideBar />
        </div>
      </div>
    );
  };
  
  export default Layout;