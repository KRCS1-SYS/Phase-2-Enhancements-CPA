import { CardIconText } from "@jumbo/shared/CardIconText";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import { Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import Fab from "@mui/material/Fab";

const ObjectCountQueries = ({ item }) => {
  const ItemComponent = item.icon;
  return (
    <CardIconText
      icon={
        <Fab
          aria-label="volume"
          color={item.color}
          sx={{
            position: "absolute",
            // left: "50%",
            // top: "0",
            height: 60,
            width: 60,
            // transform: "translate(-50%, -50%)",
          }}
        >
          <ItemComponent fontSize="large" />
        </Fab>
      }
      title={
        <Typography variant={"h4"} color={"primary.main"}>
          {item.title}
        </Typography>
      }
      subTitle={
        <Typography variant={"h6"} color={"text.secondary"}>
          {item.subTitle}
        </Typography>
      }
      color={item.color}
      disableHoverEffect={true}
      hideArrow={true}
      variant={"outlined"}
    />
  );
};
export { ObjectCountQueries };

ObjectCountQueries.propTypes = {
  item: PropTypes.object,
  subTitle: PropTypes.node,
};
