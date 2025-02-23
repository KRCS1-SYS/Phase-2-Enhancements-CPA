import React from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { JumboCard } from "@jumbo/components/JumboCard";
import { AccordionUsage } from "@app/_components/Accordion";
import { Div } from "@jumbo/shared";
import { useState } from "react";
import { PageHeader } from "@app/_components/layout/Header/components/PageHeader/PageHeader";
import { ContentLayout } from "@app/_layouts/ContentLayout";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import { IndeterminateCheckBox } from "@mui/icons-material";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks";
import ExpandCollapseButton from "@app/_components/_core/ExpandCollapseButton/ExpandCollapseButton";
import HomeNavigator from "@app/_components/_core/HomeNavigator/HomeNavigator";

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
export default function SugarPage() {
  const contactLayoutConfig = useContactLayout();
  const [expanded, setExpanded] = useState(false);
  const { sugarAreas, getSugarAreas, sugarParameters, getSugarParameters, connectWebSocket, closeWebSocket } = useParameter();
  const apiCalled = React.useRef(false); // Prevent multiple calls
  const expandToggle = () => {
    setExpanded(true);
  };
  const collapseToggle = () => {
    setExpanded(false);
  };
  
  React.useEffect(() => {
    if (!apiCalled.current) {
      const fetchSugarAreas = async () => {
        try {
          await getSugarAreas();
          if(!sugarParameters)
            await getSugarParameters();
        } catch (error) {
          console.error("Failed to fetch sugar areas:", error);
        }
      };
      fetchSugarAreas();
    }
  }, []);

   React.useEffect(() => {
        try {
          if(!apiCalled.current) {
            apiCalled.current = true;
            connectWebSocket("sugar");
          }
          return () => {
            closeWebSocket("sugar");
          };
        } catch (error) {
          console.log(error);
        }   
      }, [connectWebSocket, closeWebSocket]);

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
            direction={{sm :"column", md : "row"}}
            spacing={2}
            justifyContent={{sm :"center", md : "space-between"}}
            mb={2}
          > 
            <HomeNavigator title="Sugar Plant Dashboard"/>
            <Stack spacing={2} direction="row" m={0} sx={{ justifyContent : "flex-end"}}>
              <ExpandCollapseButton onClick={()=> expandToggle()} />
              <ExpandCollapseButton onClick={()=>collapseToggle()} label="Collapse all" icon={<UnfoldLessIcon/>} />
            </Stack>
          </Stack>
        }
        {...contactLayoutConfig}
      >
        {sugarAreas &&
          sugarAreas?.map((area, index) => (
            <AccordionUsage
              key={index}
              title={area}
              defaultExpanded={expanded}
              dashboard={"sugar"}
            />
          ))}
      </ContentLayout>
    </Container>
  );
}
