import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Chatbot.css";
import { StoreContext } from "../../Context/StoreContext";

const Chatbot = () => {
  const { url, token } = useContext(StoreContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setLocation(loc);
          console.log("✅ Location captured:", loc);
        },
        (error) => {
          console.log("⚠️ Location permission denied or error:", error.message);
          // chatbot will work without location
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
      );
    } else {
      console.log("⚠️ Geolocation not supported in this browser");
    }
  }, []);

  const sendMessage = async () => {
    if (!input) return;
    const userMsg = { role: "user", content: input };
    setMessages([...messages, userMsg]);
    setInput("");

    try {
      // Prepare headers with token if available
      const headers = {};
      if (token) {
        headers.token = token;
      }

      const res = await axios.post(
        `${url}/api/chatbot`, 
        { message: input, location },
        { headers }
      );
      const botMsg = { role: "bot", content: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Detailed Error:", error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.error 
        ? `⚠️ ${error.response.data.error}` 
        : "⚠️ Error connecting to AI server.";
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: errorMessage },
      ]);
    }
  };

  return (
    <div className="chatbot">
      <h3>🍽️ Food Assistant</h3>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <p key={i} className={msg.role}>{msg.content}</p>
        ))}
      </div>
      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Ask me what to eat..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
