import { Div } from "@jumbo/shared";
import styled from "@emotion/styled";
import {
  Avatar,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  Button,
  IconButton,
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
import { TagForm } from "../TagForm";
import { TagDetail } from "../TagDetail";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import InfoIcon from "@mui/icons-material/Info";

const Item = styled(Div)(({ theme }) => ({
  minWidth: 0,
  flexGrow: 0,
  padding: theme.spacing(0, 1),
}));

const TagListItem = ({ tag, dashboard }) => {
  const [favorite, setFavorite] = React.useState(true);
  const { showDialog, hideDialog } = useJumboDialog();
  const Swal = useSwalWrapper();

  const handleItemAction = () => {
    showDialog({
      title: "Update Tag detail",
      content: <TagForm tag={tag} dashboard={dashboard} />,
    });
  };

  const showTagDetail = React.useCallback(() => {
    showDialog({
      content: <TagDetail tag={tag} onClose={hideDialog} />,
    });
  }, [showDialog, tag]);

  function stringToStars(input) {
    return "*".repeat(input.length);
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
          spacing={0.1}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <IconButton
            aria-label="toggle password visibility"
            onClick={showTagDetail}
            size="small"
          >
            {<InfoIcon />}
          </IconButton>
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleItemAction}
            edge="end"
            size="small"
          >
            <EditIcon />
          </IconButton>
        </Stack>
      }
    >
      <Checkbox
        checked={tag.IsActive}
        onChange={""}
        inputProps={{ "aria-label": "controlled" }}
        sx={{ my: -0.5 }}
      />
      <ListItemText
        primary={
          <Typography variant={"body1"} component={"div"}>
            <Stack direction={"row"} alignItems={"center"} sx={{ minWidth: 0 }}>
              <Item
                sx={{
                  flexBasis: { md: "10%" },
                }}
              ></Item>
              <Item
                sx={{
                  flexBasis: { xs: "70%", sm: "40%", md: "30%" },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LocalOfferOutlinedIcon />
                <Item>
                  <Typography
                    variant={"h5"}
                    fontSize={14}
                    lineHeight={1.25}
                    // pt={0.5}
                    pl={1}
                    noWrap
                  >
                    {tag.TagId}
                  </Typography>
                  <Typography
                    variant={"body1"}
                    color={"text.secondary"}
                    sx={{
                      display: { md: "none" },
                    }}
                  >
                    {dashboard === "sugar"
                      ? tag.InstrumentDescription
                      : tag.ParameterName}
                  </Typography>
                </Item>
              </Item>
              <Item
                sx={{
                  flexBasis: { sm: "30%", md: "32%" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography variant={"body1"}>
                  {dashboard === "sugar"
                    ? tag.InstrumentDescription
                    : tag.ParameterName}
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { md: "10%" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography variant={"body1"} noWrap>
                  {tag.Unit}
                </Typography>
              </Item>
            </Stack>
          </Typography>
        }
      />
    </ListItem>
  );
};

export { TagListItem };
