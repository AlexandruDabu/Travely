import React from 'react';
import { Activity } from '../../../app/models/travels';

interface ActivityListProps {
    activities: Activity[] | undefined;
    handleActivityChange: (index: number, field: string, value: string) => void;
    addActivity: () => void;
    removeActivity: (index: number) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, handleActivityChange, addActivity, removeActivity }) => {
    return (
        <div>
            <label className="block text-gray-700 font-medium mb-4">Activities</label>
            {activities?.map((activity, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <input
                        type="text"
                        placeholder="Activity Name"
                        className="col-span-1 md:col-span-2 p-2 border rounded-md"
                        value={activity.description || ''}
                        onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Activity Location"
                        className="col-span-1 md:col-span-2 p-2 border rounded-md"
                        value={activity.location || ''}
                        onChange={(e) => handleActivityChange(index, 'location', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Activity Notes"
                        className="col-span-1 md:col-span-2 p-2 border rounded-md"
                        value={activity.notes || ''}
                        onChange={(e) => handleActivityChange(index, 'notes', e.target.value)}
                    />
                    <input
                        type="number"
                        min={0}
                        placeholder="Activity Cost"
                        className="col-span-1 md:col-span-2 p-2 border rounded-md"
                        value={activity.payment || ''}
                        onChange={(e) => handleActivityChange(index, 'payment', e.target.value)}
                    />
                    <input
                        type="number"
                        min={1}
                        max={5}
                        step={1}
                        placeholder="Activity Rating"
                        className="col-span-1 md:col-span-2 p-2 border rounded-md"
                        value={activity.rating || ''}
                        onChange={(e) => handleActivityChange(index, 'rating', e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => removeActivity(index)}
                        className="col-span-1 md:col-span-1 mt-2 md:mt-0 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addActivity}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
                + Add Activity
            </button>
        </div>
    );
};

export default ActivityList;
