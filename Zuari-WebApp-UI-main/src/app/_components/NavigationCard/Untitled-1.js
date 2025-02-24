  
//   API calling
  const { stateRealTimeData, connectStateWebSocket, closeStateWebSocket } =
    useParameter();
 
    const getWebSocketUrl = (state) => {
        const apiWSUrl = import.meta.env.VITE_API_WS_URL;
        return `${apiWSUrl}/sugar/state/${state}`;
      };

      React.useEffect(() => {
        try {
          if (!apiCalled.current) {
            apiCalled.current = true;
            connectStateWebSocket("sugar", state);
          }
          return () => {
            closeStateWebSocket("sugar", state);
          };
        } catch (error) {
          console.log(error);
        }
      }, [state, connectStateWebSocket, closeStateWebSocket]);
 
 {!parametersRealTimeData && <StateListLoader />}
