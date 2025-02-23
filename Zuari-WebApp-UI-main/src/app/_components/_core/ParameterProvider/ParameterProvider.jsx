import React from "react";
import { ParameterContext } from "./ParameterContext";
import { getCookieValue, eraseCookie } from "@jumbo/utilities/cookies";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";

import {
  getStateWebSocketUrl,
  getWebSocketUrl,
  sugarAreasService,
  powerEquipmentsService,
  getSugarParametersService,
  getPowerParametersService,
  parameterHistoricalDataService,
  editTagsService,
} from "./services";
import { set } from "react-hook-form";

export function ParameterProvider({ children }) {
  const [loading, setLoading] = React.useState(true);
  const [sugarAreas, setSugarAreas] = React.useState();
  const [powerEquipments, setPowerEquipments] = React.useState();
  const [sugarParameters, setSugarParameters] = React.useState();
  const [powerParameters, setPowerParameters] = React.useState();
  const [webSockets, setWebSockets] = React.useState({});
  const [stateWebSockets, setStateWebSockets] = React.useState({});
  const [realTimeData, setRealTimeData] = React.useState({});
  const [stateRealTimeData, setStateRealTimeData] = React.useState({});
  const [historyData, setHistoryData] = React.useState([]);

  const Swal = useSwalWrapper();
  const sweetAlerts = (variant, message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: variant,
      title: message,
    });
  };

  const getSugarAreas = async () => {
    setLoading(true);
    try {
      const response = await sugarAreasService();
      if (response) {
        setSugarAreas(response.areas);
      }
    } catch (error) {
      console.error("Getting Sugar Areas failed", error);
      sweetAlerts("error");
    } finally {
      setLoading(false);
    }
  };

  const getPowerEquipments = async () => {
    setLoading(true);
    try {
      const response = await powerEquipmentsService();
      if (response) {
        setPowerEquipments(response);
      }
    } catch (error) {
      console.error("Getting Sugar Areas failed", error);
      sweetAlerts("error");
    } finally {
      setLoading(false);
    }
  };

  const getSugarParameters = async () => {
    setLoading(true);
    try {
      const response = await getSugarParametersService();
      setSugarParameters(response);
    } catch (error) {
      console.error("Getting Sugar Area parameters failed", error);
      sweetAlerts(error.message);
    } finally {
      setLoading(false);
    }
  };
  const getPowerParameters = async () => {
    setLoading(true);
    try {
      const response = await getPowerParametersService();
      setPowerParameters(response);
    } catch (error) {
      console.error("Getting Sugar Area parameters failed", error);
      sweetAlerts(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getParameterHistoricalData = async ({ parameterId }) => {
    setLoading(true);
    try {
      const response = await parameterHistoricalDataService(parameterId);
      setHistoryData(response);
      // return response;
    } catch (error) {
      console.error("Getting History data by parameters failed", error);
      sweetAlerts("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const editTags = async (tagBody, tagId, dashboard) => {
    setLoading(true);
    try {
      const response = await editTagsService(tagBody, tagId, dashboard);
      if (dashboard === "sugar") {
        setSugarParameters();
      } else {
        setPowerParameters();
      }
    } catch (error) {
      console.error("Getting Sugar Areas failed", error);
      sweetAlerts("error");
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = React.useCallback(
    (dashboard) => {
      const key = `${dashboard}`;
      if (webSockets[key]) {
        console.warn(`WebSocket for ${key} is already open`);
        return;
      }

      const wsUrl = getWebSocketUrl(dashboard);
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setRealTimeData((prevData) => ({
          ...prevData,
          [key]: data,
        }));
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:");
      };

      ws.onclose = () => {
        setWebSockets((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      };

      setWebSockets((prev) => ({
        ...prev,
        [key]: ws,
      }));
    },
    [webSockets]
  );

  const closeWebSocket = React.useCallback(
    (dashboard) => {
      const key = `${dashboard}`;
      const ws = webSockets[key];
      if (ws) {
        ws.close();
      }
    },
    [webSockets]
  );

  const connectStateWebSocket = React.useCallback(
    (dashboard, state) => {
      const key = `${dashboard}-${state}`;
      if (stateWebSockets[key]) {
        console.warn(`WebSocket for ${key} is already open`);
        return;
      }

      const wsUrl = getStateWebSocketUrl(dashboard, state);
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setStateRealTimeData((prevData) => ({
          ...prevData,
          [key]: data,
        }));
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log(`WebSocket connection for ${key} closed`);
        setStateWebSockets((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      };

      setStateWebSockets((prev) => ({
        ...prev,
        [key]: ws,
      }));
    },
    [stateWebSockets]
  );

  const closeStateWebSocket = React.useCallback(
    (dashboard, state) => {
      const key = `${dashboard}-${state}`;
      const ws = stateWebSockets[key];
      if (ws) {
        ws.close();
      }
    },
    [stateWebSockets]
  );

  React.useEffect(() => {
    return () => {
      Object.values(webSockets).forEach((ws) => ws.close());
      Object.values(stateWebSockets).forEach((ws) => ws.close());
    };
  }, [webSockets, stateWebSockets]);

  return (
    <ParameterContext.Provider
      value={{
        sugarAreas,
        powerEquipments,
        loading,
        sugarParameters,
        powerParameters,
        realTimeData,
        stateRealTimeData,
        historyData,
        getSugarAreas,
        getPowerEquipments,
        getParameterHistoricalData,
        editTags,
        getPowerParameters,
        getSugarParameters,
        connectWebSocket,
        closeWebSocket,
        connectStateWebSocket,
        closeStateWebSocket,
      }}
    >
      {children}
    </ParameterContext.Provider>
  );
}
