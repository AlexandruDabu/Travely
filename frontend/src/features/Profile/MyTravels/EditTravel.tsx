import React, { useEffect, useState } from 'react';
import { Activity, Expenses, PackingList, Travel } from '../../../app/models/travels';
import axiosClient from '../../../app/services/axiosClient';
import { Navigate, redirect, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../../app/layout/LoadingSpinner';
import ActivityList from './ActivityList';
import ExpensesList from './ExpensesList';
import PackingListComponent from './PackingListComponent';
import useTravel from '../../../app/hooks/useTravels';

const EditTravel: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [travel, setTravel] = useState<Travel | null>(null);
    const {updateTravel}  = useTravel();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTravel = async () => {
            try {
                const travelToEdit = await axiosClient.get(`/travels/${id}`, { withCredentials: true });
                setTravel(travelToEdit.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTravel();
    }, [id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTravel(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                [name]: value
            };
        });
    };

    const handleActivityChange = (index: number, field: string, value: string) => {
        setTravel(prevData => {
            if (!prevData) return null;
            const updatedActivities = [...prevData.activities];
            updatedActivities[index] = { ...updatedActivities[index], [field]: field === 'payment' ? parseFloat(value) : value };
            return { ...prevData, activities: updatedActivities };
        });
    };

    const handleExpenseChange = (index: number, field: string, value: string) => {
        setTravel(prevData => {
            if (!prevData) return null;
            const updatedExpenses = [...prevData.expenses];
            updatedExpenses[index] = { ...updatedExpenses[index], [field]: field === 'amount' ? parseFloat(value) : value };
            return { ...prevData, expenses: updatedExpenses };
        });
    };

    const handlePackingItemChange = (index: number, field: string, value: string | number | boolean) => {
        setTravel(prevData => {
            if (!prevData) return null;
    
            const updatedPackingList = [...prevData.packingList];
            
            if (field === 'quantity') {
                updatedPackingList[index] = { ...updatedPackingList[index], [field]: parseInt(value as string, 10) };
            } else if (field === 'packed') {
                updatedPackingList[index] = { ...updatedPackingList[index], [field]: value as boolean };
            } else {
                updatedPackingList[index] = { ...updatedPackingList[index], [field]: value as string };
            }
            
            return { ...prevData, packingList: updatedPackingList };
        });
    };
    

    const addActivity = () => {
        setTravel(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                activities: [...prevData.activities, { description: '', location: '', notes: '', rating: 0, payment: 0 }]
            };
        });
    };

    const removeActivity = (index: number) => {
        setTravel(prevData => {
            if (!prevData) return null;
            const updatedActivities = prevData.activities.filter((_, i) => i !== index);
            return { ...prevData, activities: updatedActivities };
        });
    };

    const addExpense = () => {
        setTravel(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                expenses: [...prevData.expenses, { description: '', amount: 0, required: '' }]
            };
        });
    };

    const removeExpense = (index: number) => {
        setTravel(prevData => {
            if (!prevData) return null;
            const updatedExpenses = prevData.expenses.filter((_, i) => i !== index);
            return { ...prevData, expenses: updatedExpenses };
        });
    };

    const addPackingItem = () => {
        setTravel(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                packingList: [...prevData.packingList, { item: '', quantity: 1, packed: false }]
            };
        });
    };

    const removePackingItem = (index: number) => {
        setTravel(prevData => {
            if (!prevData) return null;
            const updatedPackingList = prevData.packingList.filter((_, i) => i !== index);
            return { ...prevData, packingList: updatedPackingList };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateTravel(id, travel)
            alert('Travel updated successfully!');
            navigate('/profiles/travels')
        } catch (err) {
            console.error('Failed to update travel:', err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Edit Travel</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-gray-700 font-medium">Title</label>
                    <input
                        value={travel?.title || ''}
                        name="title"
                        onChange={handleChange}
                        type="text"
                        className="w-full mt-2 p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Destination</label>
                    <input
                        value={travel?.destination || ''}
                        name="destination"
                        onChange={handleChange}
                        type="text"
                        className="w-full mt-2 p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Notes</label>
                    <textarea
                        name="notes"
                        onChange={handleChange}
                        value={travel?.notes || ''}
                        className="w-full mt-2 p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Total Budget</label>
                    <input
                        name="totalBudget"
                        value={travel?.totalBudget || ''}
                        onChange={handleChange}
                        type="number"
                        className="w-full mt-2 p-2 border rounded-md"
                    />
                </div>

                <div className="flex space-x-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Start Date</label>
                        <input
                            value={travel?.startDate?.split('T')[0] || ''}
                            name="startDate"
                            onChange={handleChange}
                            type="date"
                            className="w-full mt-2 p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={travel?.endDate?.split('T')[0] || ''}
                            onChange={handleChange}
                            className="w-full mt-2 p-2 border rounded-md"
                        />
                    </div>
                </div>

                <div>
                    <ActivityList 
                        activities={travel?.activities} 
                        handleActivityChange={handleActivityChange} 
                        addActivity={addActivity} 
                        removeActivity={removeActivity}/>
                </div>
                <div>
                    <ExpensesList 
                        expenses={travel?.expenses} 
                        handleExpenseChange={handleExpenseChange} 
                        addExpense={addExpense} 
                        removeExpense={removeExpense}/>
                </div>
                <div>
                    <PackingListComponent 
                        packingList={travel?.packingList} 
                        handlePackingItemChange={handlePackingItemChange} 
                        addPackingItem={addPackingItem} 
                        removePackingItem={removePackingItem}/>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                    >
                        Save Travel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTravel;
