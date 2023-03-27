import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { CONFIG, SOCKET_EVENT } from "../../../utils";

interface Context {
  socket: Socket | null;
}
const SocketContext = createContext<Context>({
  socket: null,
});

function SocketProvider(props: any) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io(CONFIG.HOST_API, {
      transports: ["websocket"],
      withCredentials: true,
    });

    setSocket(socket);

    socket.on(SOCKET_EVENT.CONNECT, () => {
      console.log("Connected to server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
      {...props}
    />
  );
}
export const useSockets = () => useContext(SocketContext);
export default SocketProvider;
