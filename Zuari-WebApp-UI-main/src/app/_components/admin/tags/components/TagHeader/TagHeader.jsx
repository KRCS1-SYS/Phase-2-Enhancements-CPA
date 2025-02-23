import { useJumboDialog } from "@jumbo/components/JumboDialog/hooks/useJumboDialog";
import styled from "@emotion/styled";
import { Div } from "@jumbo/shared";
import {
  Button,
  ButtonGroup,
  Checkbox,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Zoom,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ListIcon from "@mui/icons-material/List";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import { SearchGlobal } from "@app/_components/_core";
import React from "react";
import { LabelPopover } from "@app/_components/popovers/LabelPopover";
import { useSnackbar } from "notistack";
import { TagForm } from "../TagForm";

const Item = styled(Div)(({ theme }) => ({
  minWidth: 0,
  flexGrow: 0,
  padding: theme.spacing(0, 1),
}));

const TagHeader = ({ view, onView }) => {
  const { showDialog, hideDialog } = useJumboDialog();
  const [selectContact, setSelectContact] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleBulkDelete = () => {
    showDialog({
      variant: "confirm",
      title: "Are you sure?",
      onYes: () => {
        hideDialog();
        enqueueSnackbar("Contact has been deleted successfully.", {
          variant: "success",
        });
      },
      onNo: hideDialog,
    });
  };

  const showAddContactDialog = () => {
    showDialog({
      title: "Add new contact",
      content: <TagForm />,
    });
  };

  return (
    <>
      <ListItem component="div">
        <ListItemText
          primary={
            <Stack direction={"row"} spacing={2}>
              <Div>
                <Typography
                  variant={"h1"}
                  sx={{ flexBasis: { xs: "20%", md: "28%" } }}
                >
                  All Tags
                </Typography>
              </Div>
            </Stack>
          }
        />
      </ListItem>
      <ListItem
        component="div"
        sx={{
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <ListItemText
          primary={
            <Typography variant={"body1"} component={"div"}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                sx={{ minWidth: 0 }}
              >
                <Item
                  sx={{
                    flexBasis: { xs: "100%", sm: "13%", md: "15%", lg: "10%" },
                    justifyContent: "center",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <Typography
                    variant={"h5"}
                    fontSize={18}
                    fontWeight={700}
                    lineHeight={1.25}
                    color={"primary.main"}
                    mb={0}
                    noWrap
                  >
                    Active
                  </Typography>
                </Item>
                <Item
                  sx={{
                    flexBasis: { xs: "100%", sm: "27%", md: "30%", lg: "20%" },
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <Typography
                    variant={"h5"}
                    fontSize={18}
                    fontWeight={700}
                    lineHeight={1.25}
                    color={"primary.main"}
                    mb={0}
                    noWrap
                    sx={{
                      display: "flex",
                      justifyContent: { md: "center" },
                      mr: {
                        xs: "1.4rem",
                        sm: "1rem",
                        // md: "2.5rem",
                        lg: "2.0rem",
                      },
                    }}
                  >
                    ID
                  </Typography>
                </Item>
                <Item
                  sx={{
                    flexBasis: { xs: "70%", sm: "32%", md: "22%", lg: "29%" },
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <Typography
                    variant={"h5"}
                    fontSize={18}
                    fontWeight={700}
                    lineHeight={1.25}
                    color={"primary.main"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      ml: { md: "rem", lg: "5.3rem" },
                    }}
                  >
                    Description
                  </Typography>
                </Item>
                <Item
                  sx={{
                    flexBasis: { xs: "70%", md: "50%" },
                    display: { sm: "none" },
                  }}
                >
                  <Typography
                    variant={"h5"}
                    fontSize={16}
                    fontWeight={700}
                    lineHeight={1.25}
                    color={"primary.main"}
                    sx={{ display: "flex", justifyContent: "center" }}
                    mb={0}
                    noWrap
                  >
                    Tag Details
                  </Typography>
                </Item>
                <Item
                  sx={{
                    flexBasis: { sm: "15%", md: "20%", lg: "35%" },
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  <Typography
                    variant={"body1"}
                    noWrap
                    fontSize={18}
                    fontWeight={700}
                    lineHeight={1.25}
                    color={"primary.main"}
                    sx={{ display: "flex", justifyContent: { md: "center" } }}
                  >
                    Unit
                  </Typography>
                </Item>
                <Item
                  sx={{
                    flexBasis: { xs: "30%", sm: "15%", md: "15%", lg: "10%" },
                  }}
                >
                  <Typography
                    variant={"body1"}
                    fontSize={18}
                    fontWeight={700}
                    lineHeight={1.25}
                    sx={{
                      display: "flex",
                      justifyContent: { md: "center" },
                      ml: {
                        xs: "1.4rem",
                        sm: "1rem",
                        md: "2.5rem",
                        lg: "2.5rem",
                      },
                    }}
                    color={"primary.main"}
                  >
                    Action
                  </Typography>
                </Item>
              </Stack>
            </Typography>
          }
        />
      </ListItem>
    </>
  );
};

export { TagHeader };
