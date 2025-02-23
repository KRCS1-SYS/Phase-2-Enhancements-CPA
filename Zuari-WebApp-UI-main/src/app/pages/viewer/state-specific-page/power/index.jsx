import React from "react";
import { useParams } from "react-router-dom";
import { Container, Stack } from "@mui/material";
import { PageHeader } from "@app/_components/layout/Header/components/PageHeader/PageHeader";
import { ContentLayout } from "@app/_layouts/ContentLayout";
import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Div } from "@jumbo/shared/Div/Div";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import AccordionDetails from "@mui/material/AccordionDetails";
import { StateList } from "@app/_components/StateList/StateList";
// import Loader from "@app/_components/StateList/StateListLoader/StateListLoader";
import { StateListLoader } from "@app/_components/StateList/StateListLoader/StateListLoader";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks";
import HomeNavigator from "@app/_components/_core/HomeNavigator/HomeNavigator";
const Item = styled(Div)(({ theme }) => ({
  minWidth: 0,
  flexGrow: 0,
  padding: theme.spacing(0, 3),
}));

const useContactLayout = () => {
  const { theme } = useJumboTheme();
  return React.useMemo(
    () => ({
      wrapperOptions: {
        sx: {
          alignItems: "flex-start",
        },
      },
      contentOptions: {
        sx: {
          p: { lg: 0, xs: 0 },
        },
      },
    }),
    [theme]
  );
};

const PowerStatePage = () => {
  const contactLayoutConfig = useContactLayout();
  const { state } = useParams();
  const apiCalled = React.useRef(false);

  const { stateRealTimeData, connectStateWebSocket, closeStateWebSocket } =
    useParameter();

  let parametersRealTimeData;

  const getWebSocketUrl = (state) => {
    const apiWSUrl = import.meta.env.VITE_API_WS_URL;
    return `${apiWSUrl}/sugar/state/${state}`;
  };

  React.useEffect(() => {
    try {
      if (!apiCalled.current) {
        apiCalled.current = true;
        connectStateWebSocket("power", state);
      }
      return () => {
        closeStateWebSocket("power", state);
      };
    } catch (error) {
      console.log(error);
    }
  }, [state, connectStateWebSocket, closeStateWebSocket]);

  if (stateRealTimeData) {
    parametersRealTimeData = stateRealTimeData[`power-${state}`];
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: CONTAINER_MAX_WIDTH,
        display: "flex",
        minWidth: 0,
        flex: 1,
        flexDirection: "column",
      }}
      disableGutters
    >
      <ContentLayout
        header={
          <Stack
            direction="row"
            spacing={4}
            justifyContent="space-between"
            mb={4}
          >
            <HomeNavigator title={`Power Plant Parameters in ${state} State`} />
          </Stack>
        }
        {...contactLayoutConfig}
      >
        {!parametersRealTimeData && <StateListLoader />}
        {parametersRealTimeData && parametersRealTimeData.length > 0 && (
          <Div>
            <Div sx={{ display: "flex", flexdirection: "row", border: "Top" }}>
              <Item
                sx={{
                  flexBasis: { xs: "65%", sm: "65%", md: "35%", lg: "30%" },
                  justifyContent: "center",
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography
                  variant={"h1"}
                  fontSize={14}
                  fontWeight={700}
                  lineHeight={1.25}
                  mb={0}
                  noWrap
                >
                  Parameter Name
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { xs: "65%", sm: "60%", md: "35%", lg: "30%" },
                  justifyContent: "center",
                  display: { md: "none" },
                }}
              >
                <Typography
                  variant={"h1"}
                  fontSize={14}
                  fontWeight={700}
                  lineHeight={1.25}
                  mb={0}
                  noWrap
                >
                  Parameter Details
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { md: "30%", lg: "28%" },
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography
                  variant={"h1"}
                  fontSize={14}
                  fontWeight={700}
                  noWrap
                >
                  Description
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { md: "25%", lg: "27%" },
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography variant={"h1"} fontSize={14} fontWeight={700}>
                  Associated Equipment
                </Typography>
              </Item>
              <Item
                sx={{
                  flexBasis: { xs: "35%", sm: "35%", md: "20%", lg: "10%" },
                  ml: 2,
                }}
              >
                <Typography variant={"h1"} fontSize={14} fontWeight={700}>
                  Value
                </Typography>
              </Item>
            </Div>
            <StateList
              parametersRealTimeData={parametersRealTimeData}
              state={state}
              dashboard={"power"}
            />
          </Div>
        )}
      </ContentLayout>
    </Container>
  );
};

export { PowerStatePage };
