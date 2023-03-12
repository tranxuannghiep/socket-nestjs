import { Route, Routes } from "react-router-dom";
import LoginPage from "./modules/auth/pages";
import ChatWindow from "./modules/chat/components/ChatWindow";
import ChatPage from "./modules/chat/pages";
import LayoutChat from "./modules/chat/pages/LayoutChat";

function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="chat" element={<ChatPage />}>
        <Route index element={<LayoutChat />} />
        <Route
          path=":roomId"
          element={
            <LayoutChat>
              <ChatWindow />
            </LayoutChat>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
