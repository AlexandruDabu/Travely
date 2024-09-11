import { useContext } from 'react';
import ChatContext from '../context/chatContext';
import ChatContextType from '../models/chat';

const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within an AuthProvider');
  }
  return context;
};

export default useChat;
