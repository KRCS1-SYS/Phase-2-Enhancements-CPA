import { Card, Collapse, Grid, List } from "@mui/material";
import React from "react";
import { TransitionGroup } from "react-transition-group";
import { ViewerHeader, ViewerListItem} from "./components";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

const ViewerList = ({users}) => {
  const {loading} = useAuth();


  return (
    <Card
      sx={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        mt: 2,
      }}
    >
          <ViewerHeader/>
          <List component={"div"} disablePadding>
            <TransitionGroup>
              {users?.map((contact, index) => (
                <Collapse key={index}>
                  <ViewerListItem contact={contact} />
                </Collapse>
              ))}
            </TransitionGroup>
          </List>      
    </Card>
  );
};

export { ViewerList };
