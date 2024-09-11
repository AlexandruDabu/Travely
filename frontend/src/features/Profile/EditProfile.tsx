import React, { useEffect, useState } from 'react';
import useAuth from '../../app/hooks/useAuth';
import useTravel from '../../app/hooks/useTravels';
import LoadingSpinner from '../../app/layout/LoadingSpinner';
import { User } from '../../app/models/user';
import ImageUploader from './ImageUploader';

interface editProfileProps{
    setEditMode: (value: boolean) => void;
    followersNumber: string | undefined;
    followingsNumber: string | undefined;
}

export default function EditProfile({setEditMode, followersNumber, followingsNumber}: editProfileProps) {
    const { user, loading, updateUser } = useAuth();
    const {AllUserTravels, loadingTravels} = useTravel();
    const [userData, setUser] = useState<User | null> (null);
    
    useEffect(() => {
        if(user){
            setUser(user);
        }
    }, [user])

    if (loadingTravels || loading) {
        return <LoadingSpinner />;
    }

    const handleSave = () => {
        updateUser(user?.id, userData)
        setEditMode(false)
    };

    const handleCancel = () => {
        setEditMode(false)
        
    };
    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = e.target.name
        if(userData)
        setUser({
            ...userData,
            [name]: e.target.value
        })
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
                    <div className="mt-4 sm:mt-0 flex">
                        <button
                            onClick={handleCancel}
                            className="mr-4 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                        >
                            Save Profile
                        </button>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Picture & Info */}
                    <div className="col-span-1 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
                        <ImageUploader initialImageUrl={user?.imageurl || ''}/>
                        <input
                            name="firstName"
                            type="text"
                            value={userData?.firstName || ''}
                            onChange={(e) => handleChange(e)}
                            className="text-xl font-bold text-center mb-2 border border-gray-300 p-2 rounded"
                        />
                        <input
                            name="lastName"
                            type="text"
                            value={userData?.lastName || ''}
                            onChange={(e) => handleChange(e)}
                            className="text-xl font-bold text-center mb-2 border border-gray-300 p-2 rounded"
                        />
                        <input
                            name="email"
                            type="email"
                            value={userData?.email || ''}
                            onChange={(e) => handleChange(e)}
                            className="text-center mb-2 border border-gray-300 p-2 rounded"
                        />
                        <textarea
                            name="bio"
                            value={userData?.bio || ''}
                            onChange={(e) => handleChange(e)}
                            className="text-center border border-gray-300 p-2 rounded"
                            rows={3}
                            cols={48}
                        />
                    </div>

                    {/* Additional Info */}
                    <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="text-gray-700 font-semibold">Country</label>
                                <input
                                    name="country"
                                    type="text"
                                    value={userData?.country || ''}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">City</label>
                                <input
                                    name="city"
                                    type="text"
                                    value={userData?.city || ''}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Total Travels</label>
                                    <p className="text-gray-600">{AllUserTravels?.length}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Followers</label>
                                    <p className="text-gray-600">{followersNumber}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Following</label>
                                    <p className="text-gray-600">{followingsNumber}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="text-gray-700 font-semibold">New Password</label>
                                <input
                                    name="newPassword"
                                    type="password"
                                    value={userData?.newPassword || ''}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Re-type New Password</label>
                                <input
                                    name="verifyPassword"
                                    type="password"
                                    value={userData?.verifyPassword || ''}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
