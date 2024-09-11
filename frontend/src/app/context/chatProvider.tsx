import { useState } from "react";
import ChatContext from "./chatContext";
import { User } from "../models/user";

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [chatOpen, setChatOpen] = useState<boolean>(false);
  
    return (
      <ChatContext.Provider value={{ selectedUser, setSelectedUser, chatOpen, setChatOpen }}>
        {children}
      </ChatContext.Provider>
    );
  };