import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listTravel } from '../../app/services/TravelServices';
import { Travel } from '../../app/models/travels';
import useAuth from '../../app/hooks/useAuth';
import LoadingSpinner from '../../app/layout/LoadingSpinner';
import useTravel from '../../app/hooks/useTravels';

export default function TravelDetails() {
    const { id } = useParams();
    const [travel, setTravel] = useState<Travel | null>(null);
    const {user,loading} = useAuth();
    const {deleteTravel, shareTravel} = useTravel();
    const [isShared, setIsShared] = useState<boolean>(false)
    const navigate = useNavigate();

    useEffect(() => {
        const getTravel = async () => {
            const travel = await listTravel(id);
            setTravel(travel.data.data);
            setIsShared(travel.data.data.isShared)
        };
        getTravel();
    }, [id]);

    const totalActivities: number = travel?.activities.reduce((acc, activity) => {
        return acc + (activity.payment || 0);
    }, 0) || 0;

    const totalExpenses: number = travel?.expenses.reduce((acc, expense) => {
        return acc + (expense.amount || 0);
    }, 0) || 0;

    const totalMoney: number = travel?.totalBudget ? (travel?.totalBudget - totalActivities - totalExpenses) : 0;

    if(loading){
        <LoadingSpinner/>
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Section */}
                <div className="md:col-span-2">
                    {/* Invoice Details */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-900">{travel?.title}</h2>
                        <h4 className='text-sm text-gray-600'>{travel?.destination}</h4>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">Starts on {travel?.startDate ? new Date(travel.startDate).toDateString() : 'N/A'}</p>
                            <p className="text-sm text-gray-500">Ends on {travel?.endDate ? new Date(travel.endDate).toDateString() : 'N/A'}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8 border-b pb-4">
                        <h3 className="text-sm font-semibold text-gray-700">Description</h3>
                        <p className="text-sm text-gray-500">{travel?.notes}</p>
                    </div>

                    {/* Activities Section */}
                    <div className="mb-8 border-b pb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Activities</h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Activity</th>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Place</th>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Amount</th>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {travel?.activities.map((activity) => (
                                    <tr>
                                        <td className="py-2 border-b text-sm text-gray-600">{activity.description}</td>
                                        <td className="py-2 border-b text-sm text-gray-600">{activity.location}</td>
                                        <td className="py-2 border-b text-sm text-gray-600">{activity.payment || 'Free'}</td>
                                        <td className="py-2 border-b text-sm text-gray-600">Nothing yet</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Expenses Section */}
                    <div className="mb-8 border-b pb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Expenses</h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Expense</th>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Amount</th>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Required</th>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {travel?.expenses.map((expense) => (
                                    <tr>
                                        <td className="py-2 border-b text-sm text-gray-600">{expense.description}</td>
                                        <td className="py-2 border-b text-sm text-gray-600">${expense.amount}</td>
                                        <td className="py-2 border-b text-sm text-gray-600">Nothing yet</td>
                                        <td className="py-2 border-b text-sm text-gray-600">Nothing yet</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Packing List */}
                    <div className="mb-8 border-b pb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Packing List</h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Item</th>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Quantity</th>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Details</th>
                                    <th className="pb-2 border-b text-sm font-semibold text-gray-700">Required</th>
                                </tr>
                            </thead>
                            <tbody>
                                {travel?.packingList.map((item) => (
                                    <tr>
                                        <td className="py-2 border-b text-sm text-gray-600">{item.item}</td>
                                        <td className="py-2 border-b text-sm text-gray-600">{item.quantity}</td>
                                        <td className="py-2 border-b text-sm text-gray-600">Nothing yet</td>
                                        <td className="py-2 border-b text-sm text-gray-600">Nothing yet</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Section */}
                <div className="p-6 bg-gray-50 border rounded-md">
                    <h3 className="text-lg font-semibold text-gray-900">Total Initial Budget</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">${travel?.totalBudget}</p>
                    <p className='text-xl font-bold text-red-500 mt-3'>Activities: -${totalActivities}</p>
                    <p className='text-xl font-bold text-red-500 mt-3'>Expenses: -${totalExpenses}</p>
                    <p className='text-xl font-bold text-red-500 mt-3'>Money Used: ${totalActivities + totalExpenses}</p>
                    <p className={`text-xl font-bold ${totalMoney <= 0 ? 'text-red-500' : 'text-green-500'} mt-3`}>
                        Money left: {totalMoney <= 0 ? `-$${Math.abs(totalMoney)}` : `$${totalMoney}`}
                    </p>
                    {user?.id === travel?.userId && (
                        <div className="flex justify-end items-end h-72">
                            <button onClick={() => {
                                shareTravel(travel?.id)
                                setIsShared(prevShare => !prevShare)
                                }} className="mx-4 border border-blue-500 text-blue-500 px-4 py-2 rounded-md shadow hover:bg-blue-500 hover:text-white transition-colors">
                                {isShared ? 'Remove Share' : 'Share'}
                            </button>
                            <button onClick={() => {
                                deleteTravel(travel?.id)
                                navigate('/profiles/travels')}} className="border border-red-500 text-red-500 px-4 py-2 rounded-md shadow hover:bg-red-500 hover:text-white transition-colors">
                                Delete Travel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
