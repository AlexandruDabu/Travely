import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import SocketContextValue from '../models/socket';

export const SocketContext = createContext<SocketContextValue | null>(null);

export default SocketContext