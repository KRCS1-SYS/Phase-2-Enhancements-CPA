import { useEffect, useRef, useState } from "react";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks";

const useStateWebSocket = (section) => {
  const { connectStateWebSocket, closeStateWebSocket, stateRealTimeData } =
    useParameter();
  const apiCalled = useRef(false);
  const [parametersRealTimeData, setParametersRealTimeData] = useState(null);

  useEffect(() => {
    console.log("API calling");
    if (!apiCalled.current && section) {
      apiCalled.current = true;
      connectStateWebSocket(section, 'realtime');
    }

    return () => {
      closeStateWebSocket(section, 'realtime');
    };
  }, [section, connectStateWebSocket, closeStateWebSocket]);

  useEffect(() => {
    if (stateRealTimeData) {
      setParametersRealTimeData(stateRealTimeData[section] || null);
    }
  }, [stateRealTimeData]);

  return parametersRealTimeData;
};

export default useStateWebSocket;
