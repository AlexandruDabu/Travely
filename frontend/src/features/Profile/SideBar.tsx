import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../app/hooks/useAuth';

export default function SideBar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigator = [
    {
      pathname: `/profiles/${user?.email}`,
      active: location.pathname === `/profiles/${user?.email}`,
      name: 'My Profile',
    },
    {
      pathname: '/profiles/travels',
      active: location.pathname === '/profiles/travels',
      name: 'My Travels',
    },
    {
      pathname: `/profiles/followers`,
      active: location.pathname === `/profiles/followers`,
      name: 'My Followers',
    },
    {
      pathname: `/profiles/followings`,
      active: location.pathname === `/profiles/followings`,
      name: 'My Followings',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full h-screen">
      {/* Sidebar */}
      <div className="w-full lg:w-1/6 h-auto bg-gray-800 text-white p-6">
        {/* Hide name on smaller screens */}
        <div className="hidden lg:block text-2xl lg:text-3xl text-indigo-500 font-bold mb-8" style={{ fontFamily: "'Dancing Script', cursive" }}>
            {user?.firstName}
        </div>

        
        {/* Navigation items */}
        <ul className="flex flex-row justify-around lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4">
          {navigator.map((item) => (
            <li
              key={item.pathname}
              onClick={() => navigate(item.pathname)}
              className={`p-2 rounded-md cursor-pointer ${
                item.active ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600'
              }`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
