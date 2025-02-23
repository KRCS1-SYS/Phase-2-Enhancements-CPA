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
  Typography
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ListIcon from "@mui/icons-material/List";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import {SearchGlobal } from "@app/_components/_core";
import React from "react";
import { LabelPopover } from "@app/_components/popovers/LabelPopover";
// import { labels } from "@app/_components/admin/viewer/fake-datas";
import { useSnackbar } from "notistack";
import { ViewerForm } from "../ViewerForm/ViewerForm";

const Item = styled(Div)(({ theme }) => ({
  minWidth: 0,
  flexGrow: 0,
  padding: theme.spacing(0, 1),
}));

const ViewerHeader = ({ view, onView }) => {
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
      title: "Add new Viewer",
      content: <ViewerForm />,
    });
  };

  return (
    <>
    <ListItem component="div">
      <ListItemText
        primary={
          <Stack direction={"row"} spacing={2}>
              <Typography variant={"h3"} sx={{flexBasis: { xs: "20%", md: "28%" },}}>
                  All Users 
              </Typography>
          </Stack>
        }
      />
      <Stack direction={"row"} alignItems={"center"}>
        {/* <AppPagination /> */}
        <Button
          variant={"contained"}
          onClick={showAddContactDialog}
          sx={{
            px:1,
          }}
        >
          <PersonAddIcon />
          <Div sx={{pl:1, display: { xs: "none", sm: "block" },}}>
            Add Viewer
          </Div>
        </Button>
      </Stack>
    </ListItem>    
    <ListItem component="div"
      sx={{
        borderTop: 1,
        borderColor: "divider",
      }}
    >
    <ListItemText
        primary={
          <Typography variant={"body1"} component={"div"}>
            <Stack direction={"row"} alignItems={"center"} sx={{ minWidth: 0 }}>
              <Item
                sx={{
                  flexBasis: { xs: "100%", sm: "35%", md: "30%" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography
                  variant={"h5"}
                  fontSize={18}
                  fontWeight={700}
                  lineHeight={1.25}
                  color={"primary.main"}
                  px={3}
                  mb={0}
                  ml={2}
                  noWrap
                >
                  Name
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { xs: "75%", sm:"75%", md: "35%" },
                  display: { sm: "none" },
                }}
              >
                <Typography
                  variant={"h5"}
                  fontSize={16}
                  fontWeight={700}
                  lineHeight={1.25}
                  color={"primary.main"}
                  mb={0}
                  noWrap
                >
                   User Details
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { sm: "30%",md: "40%" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography variant={"body1"} noWrap
                fontSize={18}
                fontWeight={700}
                lineHeight={1.25}
                color={"primary.main"}
                px={3}
                mb={0}
                ml={2}
                >
                   Email
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { sm: "30%", md: "18%", lg: "22%" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography variant={"body1"} noWrap
                fontSize={18}
                fontWeight={700}
                lineHeight={1.25}
                color={"primary.main"}
                >
                   Role
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: {xs:"25%",sm:"8%", md:"5%" , lg: "1%"},
                }}
              >
                <Typography variant={"body1"} 
                fontSize={18}
                fontWeight={700}
                lineHeight={1.25}      
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

export { ViewerHeader };
