import { useState, useEffect, useRef } from "react";

const useStateWebSocket = (dashboard, state) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const apiWSUrl = import.meta.env.VITE_API_WS_URL;
    const wsUrl = `${apiWSUrl}/${dashboard}/${state}`;

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log(`Connected to WebSocket: ${wsUrl}`);
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      console.log("Received WebSocket Data:", event.data);
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current.onclose = () => {
      console.log(`WebSocket closed: ${wsUrl}`);
      setIsConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [dashboard, state]);

  const sendMessage = (message) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected.");
    }
  };

  return { data, isConnected, sendMessage };
};

export default useStateWebSocket;
