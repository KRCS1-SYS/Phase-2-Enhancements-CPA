import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { Avatar, Button, Typography, Stack, Box} from "@mui/material";
import PropTypes from "prop-types";
import { Div, Link } from "@jumbo/shared";
import { WidthNormal } from "@mui/icons-material";
import { Link as routeLink} from "react-router-dom";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Fab from "@mui/material/Fab";
import { getBackgroundColorStyle } from "@jumbo/utilities/helpers";
import { StateButton } from "../_core/StateButton/StateButton";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks/index";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import useStateWebSocket from "./useStateWebSocket";
export function NavigationCard({ title, path, description }) {
  
  const [section, setSection]= useState(title?.toLowerCase())
  const [state, setState] = useState("realtime");
  const stateData = useStateWebSocket(section, state);

  useEffect(() => {
    console.log("Updated stateData:", stateData?.data);

  }, [stateData]);

  return (
    <Card sx={{ textAlign: "center" }}>
      {/* test */}
      <CardMedia
          component="img"
          height="204"
          image= { title === "Power" ? "/assets/images/Power/power.jpg" :  "/assets/images/Sugar/sugar.jpeg" }
          alt="Paella dish"
      />
      <CardContent sx={{ position: "relative" }}>
        <Div sx={{ maxWidth: 360, marginInline: "auto" }}>
          <Typography
            variant={"h2"}
            fontWeight={"3000"}
            sx={{ fontSize: "2rem", mt: 2 }}
          >
            {title} Plant
          </Typography>
          <Typography my={2.25}>
              {description}
          </Typography>
          <Button variant={"contained"}  component={routeLink} to={path}  disableElevation >
            Enter {title} Plant
          </Button>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 3 }}
            mt={3.25}
          >
            {(stateData?.data?.filter(itm=> itm.State=="Ideal")?.length > 0)?
            <StateButton title={title} state={"Ideal"} count={stateData?.data?.filter(itm=> itm?.State=="Ideal")?.length}/>
             : <StateButton title={title} state={"Ideal"} count={0}/>} 
             {(stateData?.data?.filter(itm=> itm.State=="Caution")?.length > 0)?
            <StateButton title={title} state={"Caution"} count={stateData?.data?.filter(itm=> itm?.State=="Caution")?.length}/>
             : <StateButton title={title} state={"Caution"} count={0}/>}         
            {/* <StateButton title={title} state={"Caution"} count={0}/>          */}
            {(stateData?.data?.filter(itm=> itm.State=="Critical")?.length > 0)?
            <StateButton title={title} state={"Critical"} count={stateData?.data?.filter(itm=> itm?.State=="Critical")?.length}/>
             : <StateButton title={title} state={"Critical"} count={0}/>}  
            {/* <StateButton title={title} state={"Critical"} count={0}/>       */}
          </Stack>
        </Div>
      </CardContent>
    </Card>
  )
}

NavigationCard.propTypes = {
  title: PropTypes.node.isRequired,
  path: PropTypes.node.isRequired,
};
