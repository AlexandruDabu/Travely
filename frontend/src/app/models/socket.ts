import { Socket } from "socket.io-client";

interface SocketContextValue {
    socket: Socket | null;
    reconnectSocket: (token: string | null) => void;
  }

  export default SocketContextValue