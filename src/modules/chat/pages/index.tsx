import { Outlet } from "react-router-dom";
import SocketProvider from "./SocketProvider";

export default function ChatPage() {
  return (
    <SocketProvider>
      <Outlet />;
    </SocketProvider>
  );
}
