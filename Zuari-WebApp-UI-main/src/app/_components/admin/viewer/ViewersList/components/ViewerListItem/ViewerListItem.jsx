import { Div } from "@jumbo/shared";
import styled from "@emotion/styled";
import {
  Avatar,
  Checkbox,
  ListItem,
  ListItemAvatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import { JumboDdMenu } from "@jumbo/components";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import React from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useJumboDialog } from "@jumbo/components/JumboDialog/hooks/useJumboDialog";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { ViewerForm } from "../ViewerForm/ViewerForm";
import { ViewerDetail } from "../ViewerDetail";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import InfoIcon from "@mui/icons-material/Info";

const Item = styled(Div)(({ theme }) => ({
  minWidth: 0,
  flexGrow: 0,
  padding: theme.spacing(0, 1),
}));

const ViewerListItem = ({ contact }) => {
  const { showDialog, hideDialog } = useJumboDialog();
  const { deleteUser } = useAuth();
  const Swal = useSwalWrapper();

  const handleItemAction = async () => {
    showDialog({
      variant: "confirm",
      title: "Are you sure about deleting this contact?",
      content: "You won't be able to recover this contact later",
      onYes: async () => {
        hideDialog();
        await deleteUser(contact.UserId);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Contact has been deleted successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
      },
      onNo: hideDialog,
    });
  };

  const showContactDetail = React.useCallback(() => {
    showDialog({
      content: <ViewerDetail contact={contact} onClose={hideDialog} />,
    });
  }, [showDialog, contact]);

  function stringToStars(input) {
    return "*".repeat(input?.length);
  }

  return (
    <ListItem
      sx={{
        cursor: "pointer",
        borderTop: 1,
        borderColor: "divider",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      secondaryAction={
        <Stack
          direction={"row"}
          spacing={1}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <IconButton
            aria-label="toggle password visibility"
            onClick={showContactDetail}
            edge="end"
            size="small"
          >
            <InfoIcon />
          </IconButton>
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleItemAction}
            edge="end"
            size="small"
            sx={{
              visibility: contact.Role === "VIEWER" ? "visible" : "hidden",
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      }
    >
      <ListItemAvatar>
        <Avatar
          src={<PersonOutlineIcon />}
          sizes={"small"}
          sx={{
            boxShadow: 23,
            cursor: "pointer",
            backgroundColor: "primary.main",
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant={"body1"} component={"div"}>
            <Stack direction={"row"} alignItems={"center"} sx={{ minWidth: 0 }}>
              <Item
                sx={{
                  flexBasis: { xs: "75%", md: "30%" },
                }}
              >
                <Typography
                  variant={"h5"}
                  fontSize={14}
                  lineHeight={1.25}
                  color={contact.Role == "ADMIN" && "text.secondary"}
                  mb={0}
                  noWrap
                >
                  {contact.Name}
                </Typography>
                <Typography
                  variant={"body1"}
                  noWrap
                  color={"text.secondary"}
                  sx={{
                    display: { md: "none" },
                  }}
                >
                  {contact.Email}
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { md: "40%" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography
                  variant={"body1"}
                  noWrap
                  color={contact.Role == "ADMIN" && "text.secondary"}
                >
                  {contact.Email}
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { md: "30%" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography
                  variant={"body1"}
                  noWrap
                  color={contact.Role == "ADMIN" && "text.secondary"}
                >
                  {contact.Role}
                </Typography>
              </Item>
            </Stack>
          </Typography>
        }
      />
    </ListItem>
  );
};

export { ViewerListItem };
