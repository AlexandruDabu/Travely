import { useContext } from 'react';
import SocketContext from '../context/socketContext';
import { Socket } from 'socket.io-client';
import SocketContextValue from '../models/socket';

const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within an socketProvider');
  }
  return context;
};

export default useSocket;
