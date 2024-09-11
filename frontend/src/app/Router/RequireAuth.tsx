import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function RequireAuth() {
    const {isLoggedIn,loading} = useAuth();
    const location = useLocation();
    if(!isLoggedIn && !loading){
        return <Navigate to='/' state={{from: location}}/>
    }
    return <Outlet/>
}
