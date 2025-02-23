import React from "react";
import { PageHeader } from "@app/_components/layout/Header/components/PageHeader/PageHeader";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab, Tabs } from "@mui/material";

import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { ContentLayout } from "@app/_layouts/ContentLayout";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Container, Stack, useMediaQuery } from "@mui/material";
import { Button, Box } from "@mui/material";
import { Div } from "@jumbo/shared";
import { TagsList } from "@app/_components/admin/tags";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks/index";
import HomeNavigator from "@app/_components/_core/HomeNavigator/HomeNavigator";

const useContactLayout = () => {
  const { theme } = useJumboTheme();
  return React.useMemo(
    () => ({
      sidebarOptions: {
        sx: {
          width: 200,
          display: "flex",
          minWidth: 0,
          flexShrink: 0,
          flexDirection: "column",
          mr: 3,
          [theme.breakpoints.up("lg")]: {
            position: "sticky",
            zIndex: 5,
            top: 96,
          },
          [theme.breakpoints.down("lg")]: {
            display: "none",
          },
        },
      },
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
const TagsPage = () => {
  const [activeTab, setActiveTab] = React.useState("sugar");
  const contactLayoutConfig = useContactLayout();
  const { theme } = useJumboTheme();
  const lg = useMediaQuery(theme.breakpoints.down("lg"));
  const {
    powerParameters,
    sugarParameters,
    getPowerParameters,
    getSugarParameters,
  } = useParameter();

  React.useEffect(() => {
    const fetchPowerEquipments = async () => {
      try {
        if (!powerParameters) {
          await getPowerParameters();
        }
        if (!sugarParameters) {
          await getSugarParameters();
        }
      } catch (error) {
        console.error("Failed to fetch power equipments:", error);
      }
    };
    fetchPowerEquipments();
  }, [sugarParameters, powerParameters]);

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
        header={<HomeNavigator title="Manage Tags" />}
        {...contactLayoutConfig}
      >
        <TabContext value={activeTab} sx={{}}>
          <Div sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={(_, newTab) => setActiveTab(newTab)}>
              <Tab label="Sugar" value={"sugar"} />
              <Tab label="Power" value={"power"} />
            </TabList>
          </Div>
          <TabPanel value={"sugar"} sx={{ p: 0 }}>
            <TagsList dashboard="sugar" data={sugarParameters} />
          </TabPanel>
          <TabPanel value={"power"} sx={{ p: 0 }}>
            <TagsList dashboard="power" data={powerParameters} />
          </TabPanel>
        </TabContext>
      </ContentLayout>
    </Container>
  );
};
export default TagsPage;
