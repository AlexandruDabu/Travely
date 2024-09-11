import React from 'react';
import { PackingList } from '../../../app/models/travels';

interface PackingListProps {
    packingList: PackingList[] | undefined;
    handlePackingItemChange: (index: number, field: string, value: string | number | boolean) => void;
    addPackingItem: () => void;
    removePackingItem: (index: number) => void;
}

const PackingListComponent: React.FC<PackingListProps> = ({ packingList, handlePackingItemChange, addPackingItem, removePackingItem }) => {
    return (
        <div>
            <label className="block text-gray-700 font-medium mb-4">Packing List</label>
            {packingList?.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <input
                        type="text"
                        placeholder="Item Name"
                        className="col-span-1 md:col-span-2 p-2 border rounded-md"
                        value={item.item || ''}
                        onChange={(e) => handlePackingItemChange(index, 'item', e.target.value)}
                    />
                    <input
                        type="number"
                        min={1}
                        placeholder="Quantity"
                        className="col-span-1 md:col-span-1 p-2 border rounded-md"
                        value={item.quantity || ''}
                        onChange={(e) => handlePackingItemChange(index, 'quantity', e.target.value)}
                    />
                    <div className="col-span-1 md:col-span-1 flex items-center">
                        <input
                            type="checkbox"
                            id={`packed-${index}`}
                            className="mr-2"
                            checked={item.packed || false}
                            onChange={(e) => handlePackingItemChange(index, 'packed', e.target.checked)}
                        />
                        <label htmlFor={`packed-${index}`} className="text-gray-700">Packed</label>
                    </div>
                    <button
                        type="button"
                        onClick={() => removePackingItem(index)}
                        className="col-span-1 md:col-span-1 mt-2 md:mt-0 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addPackingItem}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
                + Add Packing Item
            </button>
        </div>
    );
};

export default PackingListComponent;
