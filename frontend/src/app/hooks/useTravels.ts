import { useContext } from 'react';
import { AuthContextType } from '../models/user';
import travelContext from '../context/travelsContext';
import { travelContextType } from '../models/travels';

const useTravel = (): travelContextType => {
  const context = useContext(travelContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useTravel;
