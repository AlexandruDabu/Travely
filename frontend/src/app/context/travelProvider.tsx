import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../services/axiosClient';
import TravelContext from './travelsContext';
import { Travel } from '../models/travels';
import useAuth from '../hooks/useAuth';

const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [AllUserTravels, setUserTravels] = useState<Travel[] | null>(null);
  const [AllSharedTravels, setSharedTravels] = useState<Travel[] | null>(null);
  const [AllSearchTravels, setSearchTravels] = useState<Travel[] | null>(null);
  const [loadingSearch, setSearchLoading] = useState(true);
  const [loadingTravels, setLoading] = useState(true);
  const {user} = useAuth();

  useEffect(() => {
    if(user){
        const getTravels = async () => {
            try{
                const response = await axiosClient.get('/allTravels', {withCredentials: true})
                const allTravels = response.data.data;
                const filteredUserTravels = allTravels.filter((travel:Travel) => travel.userId === user?.id);
                const filteredSharedTravels = allTravels.filter((travel:Travel) => travel.isShared === true);

                setUserTravels(filteredUserTravels);
                setSharedTravels(filteredSharedTravels);
                
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false);
            }
        }
        getTravels();
    }
  },[user])

//   Removing a Travel
    const deleteTravel = async(id: string | undefined) => {
        try{
            await axiosClient.delete(`/travels/delete/${id}`, {withCredentials: true})
            setUserTravels(prevTravel => {
                if(!prevTravel) return null;
                return prevTravel.filter(travel => travel.id !==id);
            })
        }catch(err){
            console.log(err)
        }
    }
// Updating a Travel
    const updateTravel = async(id: string | undefined, travel:Travel | null) => {
        try{
            const response = await axiosClient.put(`/updateTravel/${id}`, travel, {withCredentials: true})
            const updatedTravel = response.data.data
            setUserTravels(prevTravel => {
                if(!prevTravel) return null;
                return prevTravel.map(t => 
                    t.id == id ? updatedTravel : t
                )
            })
        }catch(err){
            console.log(err)
        }
    }
// SearchTerm shared
    const searchTravel = async(searchTerm: string | null ) => {
        try{
            const response = await axiosClient.get(`travel/search?searchTerm=${searchTerm}`, {withCredentials: true})
            setSearchTravels(response.data.data)
        }catch(err){
            console.log(err)
        }finally{
            setSearchLoading(false)
        }
    }
// Create a Travel
  const createTravel = async (travelData:Travel | null) => {
    try{
        const response = await axiosClient.post('/createTravel', travelData, {withCredentials: true})
        const travelAdded = response.data.data
            setUserTravels(prevTravel => {
                if(!prevTravel) return null;
                return [...prevTravel, travelAdded]
            })
    }catch(error){
        console.log(error)
    }
  }
//Share a Travel
const shareTravel = useCallback(async (id: string | undefined) => {
    try {
        const updatedTravelResponse = await axiosClient.put(`travels/share/${id}`, { withCredentials: true });
        const updatedTravel = updatedTravelResponse.data.data

        setUserTravels((prevTravels) => {
            if(prevTravels) {
                return prevTravels.map(travel =>
                    travel.id === updatedTravel.id ? updatedTravel : travel
                )
            }
            return prevTravels;
        })
        setSharedTravels((prevTravels) => {
            if (updatedTravel.isShared) {
                if (prevTravels) {
                    return [...prevTravels, updatedTravel];
                } else {
                    return [updatedTravel];
                }
            } else {
                if (prevTravels) {
                    return prevTravels.filter(travel => travel.id !== updatedTravel.id);
                }
                return prevTravels;
            }
        });
        
    } catch (err) {
        throw new Error(`Failed to share the travel`);
    }
}, []);

  return (
    <TravelContext.Provider value={{createTravel, searchTravel, updateTravel, deleteTravel, shareTravel, AllUserTravels, loadingTravels, AllSharedTravels, AllSearchTravels, loadingSearch }}>
      {children}
    </TravelContext.Provider>
  );
};

export default TravelProvider;
