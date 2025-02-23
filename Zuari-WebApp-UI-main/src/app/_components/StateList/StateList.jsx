import { Card, Collapse, Grid, List, Typography } from "@mui/material";
import React from "react";
import { TransitionGroup } from "react-transition-group";
// import { ContactListItem } from "./components/ContactListItem";
import { Dashboard } from "@mui/icons-material";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks";
import { StateListItem } from "./StateListItem/StateListItem";



const StateList = ({ parametersRealTimeData, state, dashboard }) => {
  return (
    <Card
      sx={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List component={"div"} disablePadding>
        <TransitionGroup>
            {parametersRealTimeData?.map((parameter, index) => (
              <Collapse key={index}>
                <StateListItem
                  parameter={parameter}
                  state={state}
                  dashboard={dashboard}
                />
              </Collapse>
            ))}
        </TransitionGroup>
      </List>
    </Card>
  );
};

export { StateList };
