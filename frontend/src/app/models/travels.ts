import { AxiosResponse } from "axios"

export interface Activity {
    description: string,
    location: string,
    notes: string,
    rating: number,
    payment: number | null,
}

export interface Expenses {
    amount: number | null,
    description: string,
    required: string,
}

export interface PackingList {
    item: string,
    quantity: number,
    packed: boolean
}

export interface Travel {
    id: string | undefined,
    userId?: string,
    title: string,
    destination: string,
    notes: string,
    totalBudget: number,
    startDate: string | number | Date,
    endDate: string | number | Date,
    activities: Activity[],
    expenses: Expenses[],
    packingList: PackingList[],
    userImageurl: string | undefined,
    isShared?: boolean
}

export interface travelContextType {
    loadingTravels: boolean,
    AllSharedTravels: Travel[] | null,
    AllUserTravels: Travel[] | null,
    AllSearchTravels: Travel[] | null,
    loadingSearch: boolean,
    deleteTravel: (id: string | undefined) => Promise<void>
    updateTravel: (id: string | undefined, travel: Travel | null) => Promise<void>
    searchTravel: (searchTerm: string | null) => Promise<void>
    createTravel: (travelData: Travel | null) => Promise<void>
    shareTravel: (id: string|undefined) => Promise<void>
    // deleteTravel,
    // shareTravel
}