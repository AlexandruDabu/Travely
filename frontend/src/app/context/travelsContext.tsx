import { createContext } from 'react';
import { travelContextType } from '../models/travels';

const travelContext = createContext<travelContextType | undefined>(undefined)

export default travelContext