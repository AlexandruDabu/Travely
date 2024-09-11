import React from 'react';
import { Expenses } from '../../../app/models/travels';

interface ExpensesListProps {
    expenses: Expenses[] | undefined;
    handleExpenseChange: (index: number, field: string, value: string) => void;
    addExpense: () => void;
    removeExpense: (index: number) => void;
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, handleExpenseChange, addExpense, removeExpense }) => {
    return (
        <div>
            <label className="block text-gray-700 font-medium mb-4">Expenses</label>
            {expenses?.map((expense, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <input
                        type="text"
                        placeholder="Description"
                        className="col-span-1 md:col-span-2 p-2 border rounded-md"
                        value={expense.description || ''}
                        onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Cost"
                        className="col-span-1 md:col-span-1 p-2 border rounded-md"
                        value={expense.amount || ''}
                        onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                    />
                    <select
                        className="col-span-1 md:col-span-1 p-2 border rounded-md"
                        value={expense.required || 'Required'}
                        onChange={(e) => handleExpenseChange(index, 'required', e.target.value)}
                    >
                        <option value="Required" disabled>Required?</option>
                        <option value="Yes">Yes</option>
                        <option value="Maybe">Maybe</option>
                        <option value="No">No</option>
                    </select>
                    <button
                        type="button"
                        onClick={() => removeExpense(index)}
                        className="col-span-1 md:col-span-1 mt-2 md:mt-0 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addExpense}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
                + Add Expense
            </button>
        </div>
    );
};

export default ExpensesList;
