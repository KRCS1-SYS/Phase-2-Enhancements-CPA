import React, { useState, useCallback, useEffect } from "react";
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
} from "@mui/material";
import { JumboDdMenu } from "@jumbo/components";
import { useJumboDialog } from "@jumbo/components/JumboDialog/hooks/useJumboDialog";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { SimpleLineChart } from "@app/_components/chart";
import Box from "@mui/material/Box";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks";

const Item = styled(Div)(({ theme }) => ({
  minWidth: 0,
  flexGrow: 0,
  padding: theme.spacing(0, 1),
}));

const StateListItem = ({ parameter, dashboard, state }) => {
  const { showDialog } = useJumboDialog();
  const Swal = useSwalWrapper();
  const isFirstRender = React.useRef(1);
  const { getParameterHistoricalData } = useParameter();

  const getHistoryData = useCallback(async () => {
    let paramId;
    if (dashboard === "sugar") {
      paramId = `Applications.${parameter.ApplicationName}`;
    } else if (dashboard === "power") {
      paramId = `Applications.${parameter.Section}.${parameter.TagId}`;
    } else {
      paramId = parameter.TagId;
    }
    try {
      return await getParameterHistoricalData({ parameterId: paramId });
    } catch (error) {
      console.error("Failed to fetch parameter historical data:", error);
    }
  }, [dashboard, getParameterHistoricalData, parameter]);

  const showParameterChart = useCallback(() => {
    showDialog({
      content: (
        <SimpleLineChart
          tagItem={parameter}
          dashboard={dashboard}
          getHistoryData={getHistoryData}
        />
      ),
    });
  }, [showDialog, parameter, dashboard, getHistoryData]);

  const value = parameter ? parameter.Value : "N/A";

  // Determine background color based on state
  const bgColorMap = {
    Critical: "error",
    Caution: "warning",
    Ideal: "background.box",
  };

  const bgColor = state ? `${bgColorMap[state]}.light` : "grey.300";
  const hoverBgColor = state ? `${bgColorMap[state]}.dark` : "grey.400";

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
    >
      <ListItemText
        onClick={showParameterChart}
        primary={
          <Typography variant={"body1"} component={"div"}>
            <Stack direction={"row"} alignItems={"center"} sx={{ minWidth: 0 }}>
              <Item
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexBasis: { xs: "12%", sm: "7%", md: "5%", lg: "3% " },
                }}
              >
                <LocalOfferOutlinedIcon />
              </Item>
              <Item
                sx={{
                  flexBasis: { xs: "48%", sm: "53%", md: "30%" },
                }}
              >
                <Typography
                  variant={"h1"}
                  fontSize={14}
                  lineHeight={1.25}
                  mb={0}
                >
                  {parameter.TagName}
                </Typography>
                <Typography
                  variant={"body1"}
                  color={"text.secondary"}
                  sx={{
                    display: { md: "none" },
                  }}
                >
                  {dashboard === "sugar"
                    ? parameter.InstrumentDescription
                    : parameter.ParameterName}
                </Typography>
                <Typography
                  variant={"body1"}
                  sx={{
                    display: { md: "none" },
                  }}
                >
                  {dashboard === "sugar"
                    ? parameter.Area
                    : parameter.AssociatedEquipment}
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { md: "30%", lg: "35%" },
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography variant={"body1"}>
                  {dashboard === "sugar"
                    ? parameter.InstrumentDescription
                    : parameter.ParameterName}
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { md: "25%", lg: "30%" },
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography variant={"body1"}>
                  {dashboard === "sugar"
                    ? parameter.Area
                    : parameter.AssociatedEquipment}
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { xs: "40%", sm: "40%", md: "20%", lg: "15%" },
                }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  ml={1}
                  sx={{
                    width: "6rem",
                    height: "2rem",
                    borderRadius: ".4rem",
                    color: "primary.main",
                    bgcolor: bgColor,
                    "&:hover": {
                      bgcolor: hoverBgColor,
                      color: "primary.contrastText",
                    },
                  }}
                >
                  <Typography variant={"body1"} noWrap>
                    {value} {parameter.Unit}
                  </Typography>
                </Box>
              </Item>
            </Stack>
          </Typography>
        }
      />
    </ListItem>
  );
};

export { StateListItem };
