import { Route, Routes } from "react-router-dom";
import LoginPage from "./modules/auth/pages";
import ChatPage from "./modules/chat/pages";

function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="chat" element={<ChatPage />} />
    </Routes>
  );
}

export default App;
