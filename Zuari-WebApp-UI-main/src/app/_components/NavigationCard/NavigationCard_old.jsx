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


export function NavigationCard({ title, path, description }) {
 
  return (
    <Card sx={{ textAlign: "center" }}>
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
            <StateButton title={title} state={"Ideal"}/>              
            <StateButton title={title} state={"Caution"}/>              
            <StateButton title={title} state={"Critical"}/>              
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
