import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserProvider";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

let globalSocket = null;

export function createSocket(userId) {
  if (!userId) {
    console.log("createSocket: userId non valido");
    return null;
  }

  if (globalSocket) {
    globalSocket.disconnect();
    globalSocket = null;
  }

  try {
    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const newSocket = io(socketUrl, {
      transports: ["polling", "websocket"],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      forceNew: true,
    });

    globalSocket = newSocket;

    newSocket.on("connect", () => {
      newSocket.emit("register", userId);
    });

    newSocket.on("registered", (data) => {
      //console.log("REGISTRAZIONE CONFERMATA:", data)
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnesso da socket.io, motivo:", reason);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      newSocket.emit("register", userId);
    });

    newSocket.on("connect_error", (error) => {
      console.error("ERRORE connessione socket:", error);
    });

    return newSocket;
  } catch (error) {
    console.error("Errore creazione socket:", error);
    return null;
  }
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    if (!socket || !socket.connected) {
      const newSocket = createSocket(user.id);
      if (newSocket) {
        setSocket(newSocket);
      }
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      if (globalSocket) {
        globalSocket.disconnect();
        globalSocket = null;
      }
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const useLocalSocket = () => {
  return useSocket();
};
