import { Card, Collapse, Grid, List } from "@mui/material";
import React from "react";
import { TransitionGroup } from "react-transition-group";
// import { parmeter } from "./components/ContactListItem";
import { ParameterListItem } from "./components/ParameterListItem";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks";
import { Dashboard } from "@mui/icons-material";
import { ParameterListLoader } from "./components/ParameterListLoader/ParameterListLoader";
import { Div } from "@jumbo/shared/Div/Div";

const ParametersList = ({ title, dashboard }) => {
  const {
    powerParameters,
    sugarParameters,
    realTimeData,
    connectWebSocket,
    closeWebSocket,
  } = useParameter();

  const apiCalled = React.useRef(false);
  const wsRef = React.useRef(false);

  let parametersData;
  let parametersRealTimeData;

  if (dashboard == "sugar") {
    parametersData = sugarParameters?.filter(
      (item) => item.Area === title && item.IsActive
    );
  } else {
    parametersData = powerParameters?.filter(
      (item) => item.AssociatedEquipment === title && item.IsActive
    );
  }

  if (realTimeData) {
    parametersRealTimeData = realTimeData[`${dashboard}`];
  }

  return (
    <Div
      sx={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {!parametersData && <ParameterListLoader />}
      <List component={"div"} disablePadding>
        <TransitionGroup>
          {parametersData &&
            parametersData.map((parameter, index) => (
              <Collapse key={index}>
                <ParameterListItem
                  parameter={parameter}
                  parametersRealTimeData={parametersRealTimeData}
                  dashboard={dashboard}
                />
              </Collapse>
            ))}
        </TransitionGroup>
      </List>
    </Div>
  );
};

export { ParametersList };
