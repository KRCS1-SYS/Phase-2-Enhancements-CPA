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
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Div } from "@jumbo/shared";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ContentLayout } from "@app/_layouts/ContentLayout/ContentLayout";

const ViewerDetail = ({ contact, onClose }) => {
  const [Value, setValue] = React.useState(true);

  function stringToStars(input) {
    return "*".repeat(input.length);
  }

  const password = "Zuari";

  const handleTogglePassword = () => {
    setValue(!Value);
  };

  return (
    <Div sx={{ m: (theme) => theme.spacing(-2.5, -3) }}>
      <CardHeader
        title={contact?.Name}
        subheader={contact?.designation}
        avatar={<PersonOutlineIcon size="medium" />}
        backgroundColor={"primary.main"}
        action={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
      />
      <List disablePadding>
        <ListItem sx={{ px: 4 }}>
          <ListItemAvatar sx={{ minWidth: 66 }}>
            <Avatar
              variant="rounded"
              sx={{
                height: 48,
                width: 48,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
              }}
            >
              <PersonOutlineIcon sx={{ color: "primary.light" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant={"body1"} color={"text.secondary"} mb={0.5}>
                Name
              </Typography>
            }
            secondary={
              <Typography variant={"h5"} mb={0}>
                {contact?.Name}
              </Typography>
            }
          />
        </ListItem>
        <Divider component={"li"} />
        <ListItem sx={{ px: 4 }}>
          <ListItemAvatar sx={{ minWidth: 66 }}>
            <Avatar
              variant="rounded"
              sx={{
                height: 48,
                width: 48,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
              }}
            >
              <MailOutlineIcon sx={{ color: "primary.light" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant={"body1"} color={"text.secondary"} mb={0.5}>
                Email
              </Typography>
            }
            secondary={
              <Typography variant={"h5"} mb={0}>
                <Stack direction={"row"} alignItems={"center"} spacing={8}>
                  <Div
                    sx={{
                      pt: 0.5,
                    }}
                  >
                    {contact?.Email}
                  </Div>
                </Stack>
              </Typography>
            }
          />
        </ListItem>
        <Divider component={"li"} />
      </List>
    </Div>
  );
};

export { ViewerDetail };
