import React from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { AccordionUsage } from "@app/_components/Accordion";
import { Div } from "@jumbo/shared";
import { useState } from "react";
import { PageHeader } from "@app/_components/layout/Header/components/PageHeader/PageHeader";
import { Section } from "@app/_components/_core/Section";
import { ContentLayout } from "@app/_layouts/ContentLayout";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
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
export default function PowerPage() {
  const contactLayoutConfig = useContactLayout();
  const [expandTurbine, setExpandTurbine] = useState(false);
  const [expandBoiler, setExpandBoiler] = useState(false);
  const { powerEquipments, getPowerEquipments, getPowerParameters, getSugarParameters, sugarParameters, powerParameters,connectWebSocket, closeWebSocket} = useParameter();
  const apiCalled = React.useRef(false); // Prevent multiple calls

  const expandToggle = async (value) => {
    if (value === "Turbine") {
      setExpandTurbine(true);
    } else if (value === "Boiler") {
      setExpandBoiler(true);
    }
  };

  const collapseToggle = (value) => {
    if (value === "Turbine") {
      setExpandTurbine(false);
    } else if (value === "Boiler") {
      setExpandBoiler(false);
    }
  };
   
  React.useEffect(() => {
    if (!apiCalled.current) {
      const fetchPowerEquipments = async () => {
        try {
          await getPowerEquipments();
          if(!powerParameters){
            await getPowerParameters();
          }
        } catch (error) {
          console.error("Failed to fetch power equipments:", error);
        }
      };

      fetchPowerEquipments();
    }
  }, []);

  React.useEffect(() => {
      try {
        if(!apiCalled.current) {
          apiCalled.current = true;
          connectWebSocket("power");
        }
        return () => {
          closeWebSocket("power");
        };
      } catch (error) {
        console.log(error);
      }   
    }, [connectWebSocket, closeWebSocket]);

  const turbineEquipment = powerEquipments
    ?.filter((item) => item.Section === "Turbine")
    .map((item) => item.AssociatedEquipment);
  const boilerEquipment = powerEquipments
    ?.filter((item) => item.Section === "Boiler")
    .map((item) => item.AssociatedEquipment);

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
          <HomeNavigator title="Power Plant Dashboard"/>
        }
        {...contactLayoutConfig}
      >
        <Stack
            direction="row"
            spacing={4}
            justifyContent="space-between"
            mb={2}
            pb={2}
            alignItems="center"
          >
            <Section title={"Boiler"} />
            <Stack spacing={2} direction="row" m={0}>
              <ExpandCollapseButton onClick={()=> expandToggle("Boiler")} />
              <ExpandCollapseButton onClick={()=>collapseToggle("Boiler")} label="Collapse all" icon={<UnfoldLessIcon/>} />
            </Stack>
        </Stack>
          {boilerEquipment &&
            boilerEquipment.map((equipment, index) => (
              <AccordionUsage
                title={equipment}
                id={index}
                defaultExpanded={expandBoiler}
                dashboard={"power"}
              ></AccordionUsage>
            ))}
        <Stack
            direction="row"
            spacing={4}
            justifyContent="space-between"
            mt={3}
            mb={1}
            py={2}
            alignItems="center"
          >
            <Section title={"Turbine"} />
            <Stack spacing={2} direction="row" m={0} >
              <ExpandCollapseButton onClick={()=> expandToggle("Turbine")} />
              <ExpandCollapseButton onClick={()=> collapseToggle("Turbine")} label="Collapse all" icon={<UnfoldLessIcon/>} />
            </Stack>
        </Stack> 
        {turbineEquipment &&
          turbineEquipment.map((equipment, index) => (
            <AccordionUsage
              title={equipment}
              id={index}
              defaultExpanded={expandTurbine}
              dashboard={"power"}
            ></AccordionUsage>
          ))}
      </ContentLayout>
    </Container>
  );
}
