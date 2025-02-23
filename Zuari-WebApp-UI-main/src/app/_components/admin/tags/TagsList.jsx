import { Card, Collapse, Grid, List } from "@mui/material";
import React from "react";
import { TransitionGroup } from "react-transition-group";
import {TagHeader} from "./components/TagHeader";
import { TagListItem } from "./components/TagListItem/TagListItem";
import { TagListLoader } from "./components/TagListLoader/TagListLoader";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks/index";
import { Facebook } from 'react-content-loader'

const TagsList = ({dashboard, data}) => {
  const {loading} = useParameter();
 
  if(loading)
    return <TagListLoader/>

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
      <TagHeader />
          <List component={"div"} disablePadding>
            <TransitionGroup> 
              {data && data?.map((tag, index) => (
                <Collapse key={index}>
                  <TagListItem tag={tag} dashboard={dashboard}/>
                </Collapse>
              ))}
            </TransitionGroup>
          </List>          
    </Card>
  );
};
export { TagsList };
