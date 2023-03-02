import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const SOCKET_URL = "http://localhost:5000";
const socket = io(SOCKET_URL);
function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("newConnection", (data) => {
      console.log(data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("message", (data) => {
      setMessage(data);
    });

    socket.on("reply", (message) => {
      console.log(message);
    });
  }, []);

  const handleSend = () => {
    socket.emit("message", "Hello from client!");
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Message received: {message}</p>
        <button onClick={handleSend}>Send message</button>
      </header>
    </div>
  );
}

export default App;
