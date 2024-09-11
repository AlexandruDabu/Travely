import { User } from "./user";

interface ChatContextType {
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
    chatOpen: boolean;
    setChatOpen: (open: boolean) => void;
  }

  export default ChatContextType