import { createContext } from 'react';
import { AuthContextType } from '../models/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
