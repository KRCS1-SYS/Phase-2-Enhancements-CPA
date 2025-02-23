import CloseIcon from "@mui/icons-material/Close";
import {
  alpha,
  Avatar,
  ListItem,
  IconButton,
  ListItemAvatar,
  CardHeader,
  ListItemText,
  List,
  Typography,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import ClassIcon from "@mui/icons-material/Class";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Div } from "@jumbo/shared";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const TagDetail = ({ tag, onClose }) => {
  const [Value, setValue] = React.useState(true);

  function stringToStars(input) {
    return "*".repeat(input.length);
  }

  function addSpaceToCamelCase(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  const password = "Zuari";

  const handleTogglePassword = () => {
    setValue(!Value);
  };

  return (
    <Div sx={{ m: (theme) => theme.spacing(-2.5, -3) }}>
      <CardHeader
        title={tag?.TagName}
        subheader={tag?.TagId}
        avatar={<ClassIcon />}
        backgroundColor={"primary.main"}
        action={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
      />

      <List disablePadding>
        {Object.entries(tag).map(([key, value]) => (
          <ListItem sx={{ px: 4 }}>
            {/* <ListItemAvatar sx={{ minWidth: 66 }}>
              <Avatar
                variant="rounded"
                sx={{
                  height: 48,
                  width: 48,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
                }}
              >
                <InfoIcon sx={{ color: "primary.light" }} />
              </Avatar>
            </ListItemAvatar> */}
            <ListItemText
              primary={
                <Typography variant={"body1"} color={"text.secondary"} mb={0.5}>
                  {addSpaceToCamelCase(key)}
                </Typography>
              }
              secondary={
                <Typography variant={"h5"} mb={0}>
                  {value !== undefined && value !== null
                    ? String(value)
                    : "N/A"}
                </Typography>
              }
            />
            <Divider component={"li"} />
          </ListItem>
        ))}
      </List>
    </Div>
  );
};

export { TagDetail };
