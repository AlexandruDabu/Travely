import React, { useState, useEffect } from 'react';
import { AuthCheckResponse, Token, User } from '../models/user';
import axiosClient from '../services/axiosClient';
import AuthContext from './authContext';
import axios from 'axios';
import { Navigate, redirect } from 'react-router-dom';
import LoadingSpinner from '../layout/LoadingSpinner';
import { io, Socket } from 'socket.io-client';
import useSocket from '../hooks/useSocket';

class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}


const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<User[] | null>(null)
  const [followings, setFollowings] = useState<User[] | null>(null)

  const loadData = async () => {
    try {
      const response = await axiosClient.get<AuthCheckResponse>('/auth/check', { withCredentials: true });
      const allFollowings = await axiosClient.get(`/followings`, {withCredentials: true})
      const allFollowers = await axiosClient.get(`/followers`, {withCredentials: true})
      setFollowings(allFollowings.data.data)
      setFollowers(allFollowers.data.data)
      setUser(response.data.data)
      setIsLoggedIn(true);
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
      throw new AuthError('Authentication check failed', 401);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await axiosClient.post<{ user: User, token: Token }>('/auth/login', credentials, { withCredentials: true });
      setUser(response.data.user);
      setIsLoggedIn(true);
      localStorage.setItem('authToken', response.data.token.token)
    } catch (error) {
        throw new Error('Logged in Failed')
    }
  };

  const register = async(credentials: {email: string; password: string; lastName: string; firstName: string, city: string | null, country: string | null}) => {
    try{
        const response = await axiosClient.post<{user: User, token: Token}>('/auth/register', credentials, {withCredentials: true});
        setUser(response.data.user);
        setIsLoggedIn(true);
        localStorage.setItem('authToken', response.data.token.token)
    }catch(error) {
        throw new Error('Registration failed')
    }
  }

  const updateUser = async(id:string | undefined, user:User | null) => {
    try{
      const response = await axiosClient.put(`/auth/updateUser/${id}`, user, {withCredentials: true});
      const updatedUser = response.data.data.updatedUser
      setUser(prevUser => {
        if(!prevUser) return null;
          return {
            ...prevUser,
            ...updatedUser
        }
      })
    }catch(err){
      throw new Error(`Failed updating the data`)
    }
  }

  const updateImage = async(id: string | undefined, imageurl: string | null) => {
    try{
      const response = await axiosClient.put(`/auth/updateImage/${id}`, {imageurl}, {withCredentials: true});
      const updatedUser = response.data.data;
      setUser(prevUser => {
        if(!prevUser) return null;
        return {
          ...prevUser,
          ...updatedUser
        }
      })
    }catch(err){
      throw new Error(`Failed updating the image`);
    }
  }

  const logout = async () => {
    try {
      await axiosClient.post(`/auth/setOffline/${user?.id}`)
      localStorage.removeItem('authToken')
      setIsLoggedIn(false)
      redirect('/login')
    } catch (error) {

    }
  };

  if(loading) {
    <LoadingSpinner/>
  }

  return (
    <AuthContext.Provider value={{followers, followings, user, loading, isLoggedIn, login, logout, register, updateUser, updateImage }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
