import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { ParametersList } from "../ParameterList";
import { Div } from "@jumbo/shared/Div/Div";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import styled from "@emotion/styled";
import { JumboIconButton } from "@jumbo/components";
import { Box } from "@mui/material";
import Loader from "./Loader/Loader";

//adding for testing

const Item = styled(Div)(({ theme }) => ({
  minWidth: 0,
  flexGrow: 0,
  padding: theme.spacing(0, 3),
}));

const AccordionUsage = ({
  title,
  children,
  sx,
  headerSx,
  id,
  defaultExpanded,
  dashboard,
}) => {
  const [expand, setExpanded] = React.useState(defaultExpanded);

  React.useEffect(() => {
    setExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const handleAccordionChange = () => {
    setExpanded(!expand);
  };

  return (
    <Accordion
      sx={{ m: ".2rem", ...sx }}
      expanded={expand}
      key={id}
      onChange={handleAccordionChange}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${id}-content`}
        id={`panel${id}-header`}
        sx={{
          fontWeight: "600",
          fontSize: "1rem",
          paddingY: "0px",
          ...headerSx,
        }}
      >
        {title}
      </AccordionSummary>
      <AccordionDetails>
        <Div sx={{ display: "flex", flexdirection: "row", border: "Top" }}>
          <Item
            sx={{
              flexBasis: { xs: "75%", sm: "80%", md: "35%", lg: "33%" },
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
              flexBasis: { xs: "72%", sm: "62%", md: "40%", lg: "25%" },
              display: { md: "none" },
              pl: { xs: "1rem", sm: "2rem", md: 0, lg: 0 },
            }}
          >
            <Typography
              variant={"h1"}
              fontSize={14}
              fontWeight={700}
              lineHeight={1.25}
            >
              Parameter Details
            </Typography>
          </Item>
          <Item
            sx={{
              flexBasis: { md: "45%", lg: "45%" },
              display: { xs: "none", md: "block" },
            }}
          >
            <Typography variant={"h1"} fontSize={14} fontWeight={700} noWrap>
              Description
            </Typography>
          </Item>
          <Item
            sx={{
              flexBasis: { xs: "35%", sm: "38%", md: "20%", lg: "10%" },
            }}
          >
            <Typography variant={"h1"} fontSize={14} fontWeight={700}>
              Value
            </Typography>
          </Item>
        </Div>
        {expand && <ParametersList title={title} dashboard={dashboard} />}
      </AccordionDetails>
    </Accordion>
  );
};

export { AccordionUsage };

AccordionUsage.propTypes = {
  item: PropTypes.object,
  children: PropTypes.node,
};
