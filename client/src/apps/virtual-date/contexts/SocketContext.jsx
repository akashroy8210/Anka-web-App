import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children, isAdmin = false, customInstanceId }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [lastEventText, setLastEventText] = useState("Connected");

  // Real-time surprise event states
  const [heartRainActive, setHeartRainActive] = useState(false);
  const [shootingStarActive, setShootingStarActive] = useState(false);
  const [shootingStarMessage, setShootingStarMessage] = useState("");
  const [knockKnockActive, setKnockKnockActive] = useState(false);
  const [unlockedMemories, setUnlockedMemories] = useState(new Set());
  const [activeVoiceNote, setActiveVoiceNote] = useState(null);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownDuration, setCountdownDuration] = useState(10);
  const [countdownMessage, setCountdownMessage] = useState("");
  const [activeQuote, setActiveQuote] = useState("");
  const [finaleTriggered, setFinaleTriggered] = useState(false);
  const [themeOverride, setThemeOverride] = useState(null);
  const [liveMessages, setLiveMessages] = useState([]);

  useEffect(() => {
    // Dynamically connect to the local server or production host
    const serverUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? 'http://localhost:5000'
        : window.location.origin);
    
    // Parse roomId from URL path /v/:id or /v/:id/admin or pass prop
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    let roomId = customInstanceId;
    if (!roomId) {
      if (pathParts[0] === "v" && pathParts[1]) {
        roomId = pathParts[1];
      } else if (pathParts[0] === "s" && pathParts[1]) {
        roomId = pathParts[1];
      } else {
        roomId = "default";
      }
    }

    const newSocket = io(serverUrl, {
      query: { 
        isAdmin: isAdmin ? "true" : "false",
        roomId: roomId
      },
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log(`Socket connected: ${newSocket.id} (Admin: ${isAdmin})`);
      newSocket.emit("join-room", roomId);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    // Listen for status updates (primarily for the Admin Connection Panel)
    newSocket.on("status_update", (data) => {
      setActiveUsersCount(data.activeUsersCount);
      setLastEventText(data.lastEvent);
    });

    // Listen to AnKa's native live control trigger
    newSocket.on("live-trigger", ({ action, data }) => {
      console.log("Anka live control trigger received: ", action, data);
      switch (action) {
        case "heart_rain":
        case "confetti":
          setHeartRainActive(true);
          setTimeout(() => setHeartRainActive(false), 9000);
          break;
        case "shooting_star":
        case "popup":
          setShootingStarActive(true);
          setShootingStarMessage(data?.message || "Just wanted to remind you that you're loved ❤️");
          setTimeout(() => setShootingStarActive(false), 6000);
          break;
        case "knock":
          setKnockActive(true);
          break;
        case "play_voice":
          if (data?.audioUrl) {
            setActiveVoiceNote(data.audioUrl);
          }
          break;
        case "show_countdown":
          setCountdownDuration(data?.duration || 10);
          setCountdownMessage(data?.message || "Surprise incoming!");
          setCountdownActive(true);
          break;
        case "display_quote":
          if (data?.text) {
            setActiveQuote(data.text);
            setTimeout(() => setActiveQuote(""), 7000);
          }
          break;
        case "change_theme":
          if (data?.theme) {
            setThemeOverride(data.theme);
          }
          break;
        case "unlock_memory":
          if (data?.memoryId) {
            setUnlockedMilestones((prev) => {
              const copy = new Set(prev);
              copy.add(Number(data.memoryId));
              return copy;
            });
          }
          break;
        case "fireworks":
        case "special_finale":
          setFinaleTriggered(true);
          break;
        case "send_message":
          if (data?.text) {
            const id = Date.now() + Math.random();
            const newMessage = { id, text: data.text };
            setLiveMessages((prev) => [...prev, newMessage]);
            setTimeout(() => {
              setLiveMessages((prev) => prev.filter((m) => m.id !== id));
            }, 7000);
          }
          break;
        default:
          console.warn("Unknown live-trigger action:", action);
      }
    });

    // Listen for magical surprise triggers from the boyfriend
    newSocket.on("magical_event", (data) => {
      const { event, payload } = data;
      console.log("Magical event received: ", event, payload);

      switch (event) {
        case "heart_rain":
          setHeartRainActive(true);
          // Auto clear rain after 9 seconds
          setTimeout(() => setHeartRainActive(false), 9000);
          break;

        case "shooting_star":
          setShootingStarActive(true);
          setShootingStarMessage(payload?.message || "Just wanted to remind you that you're loved ❤️");
          // Clear shooting star graphic after 6 seconds
          setTimeout(() => setShootingStarActive(false), 6000);
          break;

        case "knock":
          setKnockKnockActive(true);
          break;

        case "unlock_memory":
          if (payload?.memoryId) {
            setUnlockedMemories((prev) => {
              const copy = new Set(prev);
              copy.add(Number(payload.memoryId));
              return copy;
            });
          }
          break;

        case "play_voice":
          if (payload?.audioUrl) {
            setActiveVoiceNote(payload.audioUrl);
          }
          break;

        case "show_countdown":
          setCountdownDuration(payload?.duration || 10);
          setCountdownMessage(payload?.message || "Surprise incoming!");
          setCountdownActive(true);
          break;

        case "display_quote":
          if (payload?.text) {
            setActiveQuote(payload.text);
            // Hide quote overlay card after 7 seconds
            setTimeout(() => setActiveQuote(""), 7000);
          }
          break;

        case "change_theme":
          if (payload?.theme) {
            setThemeOverride(payload.theme);
          }
          break;

        case "special_finale":
          setFinaleTriggered(true);
          break;

        case "send_message":
          if (payload?.text) {
            const id = Date.now() + Math.random();
            const newMessage = {
              id,
              text: payload.text
            };
            setLiveMessages((prev) => [...prev, newMessage]);
            // Clear message notification after 7 seconds
            setTimeout(() => {
              setLiveMessages((prev) => prev.filter((m) => m.id !== id));
            }, 7000);
          }
          break;

        default:
          console.warn("Unhandled socket event: ", event);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [isAdmin]);

  const triggerEvent = (event, payload = {}) => {
    if (socket && isAdmin) {
      socket.emit("trigger_event", { event, payload });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        activeUsersCount,
        lastEventText,
        triggerEvent,
        
        // Event states exposed to client
        heartRainActive,
        setHeartRainActive,
        shootingStarActive,
        setShootingStarActive,
        shootingStarMessage,
        knockKnockActive,
        setKnockKnockActive,
        unlockedMemories,
        setUnlockedMemories,
        activeVoiceNote,
        setActiveVoiceNote,
        countdownActive,
        setCountdownActive,
        countdownDuration,
        countdownMessage,
        activeQuote,
        setActiveQuote,
        finaleTriggered,
        setFinaleTriggered,
        themeOverride,
        setThemeOverride,
        liveMessages,
        setLiveMessages
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
