import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import { useSmallScreen } from "@app/_hooks";

const ExpandCollapseButton = ({ onClick, label = "Expand All", icon = <UnfoldMoreIcon />, ...props }) => {
    const smallScreen = useSmallScreen();

    return (
    <Button
      variant="contained"
      onClick={onClick}
      disableRipple
      {...props}
    >
      <Stack direction="row" spacing={1} justifyContent="space-between">
        {!smallScreen && <Typography>{label}</Typography>}
        {icon}
      </Stack>
    </Button>
  );
};

export default ExpandCollapseButton;
