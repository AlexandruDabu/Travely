import { createContext } from 'react';
import ChatContextType from '../models/chat';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export default ChatContext;
