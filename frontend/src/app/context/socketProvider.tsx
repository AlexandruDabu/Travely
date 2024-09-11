import React, { useState, useEffect, createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import SocketContext from './socketContext';
import useAuth from '../hooks/useAuth';
import axiosClient from '../services/axiosClient';
import debounce from 'lodash/debounce';


// Create the context for socket
const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const {user} = useAuth();

  // Function to reconnect or establish a new socket connection
  const reconnectSocket = (token: string | null) => {
    if (socket) {
      socket.disconnect(); // Close the current connection if it exists
    }

    // Establish a new connection
    const newSocket = io('http://localhost:3000', {
      auth: {
        token: token,
      },
    });

    // Set the new socket in state
    setSocket(newSocket);

    // Handle connection and disconnection events
    newSocket.on('connect', () => {
      console.log('Socket connected with new token:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  };

  // Automatically attempt connection on mount with existing token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      reconnectSocket(token); // Attempt to reconnect if token exists
      setOnline();
    }
  }, []);

  // GET THIS OUT OF HERE WHEN U HAVE TIME !
  const setOffline = async() => {
    if(user) {
      try{
        await axiosClient.post(`/auth/setOffline/${user.id}`)
      }catch(err){
        console.log(err)
      }
    }
  }

  const setOnline = async () => {
    console.log('setonline')
    if (user) {
      try {
        await axiosClient.post(`/auth/setOnline/${user.id}`);
      } catch (err) {
        console.error('Error setting user online', err);
      }
    }
  };

  const setOfflineWithBeacon = () => {
    if (user) {
      const url = `/auth/setOffline/${user.id}`;
      const data = new Blob([], { type: 'application/json' });
      const success = navigator.sendBeacon(url, data);
  
      if (!success) {
        // Fallback to an asynchronous request if sendBeacon fails
        setOffline();
      }
    }
  };
  

  useEffect(() => {
    // Handle when user leaves or closes the page
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      setOfflineWithBeacon(); // Use sendBeacon to ensure offline status is sent
    };

    // Handle tab visibility changes (user switching tabs)
    const handleVisibilityChange = debounce(() => {
      if (document.visibilityState === 'hidden') {
        setOffline(); // Mark offline when tab is hidden
      } else if (document.visibilityState === 'visible') {
        setOnline(); // Mark online when tab is visible
      }
    }, 300); // 300ms debounce to avoid rapid event firing

    // Attach event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  // GET THIS OUT OF HERE WHEN U HAVE TIME !
  return (
    <SocketContext.Provider value={{ socket, reconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
