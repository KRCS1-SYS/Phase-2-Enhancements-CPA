import { Span } from "@jumbo/shared";
import Popover from "@mui/material/Popover";
import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

const JumboDdPopover = ({ triggerButton, children, sx }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = React.useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <Span onClick={handleClick} sx={sx}>
        {triggerButton}
      </Span>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top", // The top of the popover aligns with the anchor's bottom
          horizontal: "left", // The left of the popover aligns with the anchor's left
        }}
        PaperProps={{
          sx: {
            maxWidth: {
              xs: 250, // 300px on extra-small screens
              sm: 250, // 400px on small screens
              md: 250, // 500px on medium screens and above
            },
            width: "100%",
            padding: 2, // 16px padding (assuming theme spacing unit is 8px)
            boxSizing: "border-box",
          },
        }}
        sx={{
          mt: 2,
          mr: 6,
          position: "absolute",
          right: "30px",
          zIndex: 1400,
        }}
      >
        <Box
          onClick={handleClose}
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflow: "auto", // Adds scrollbars if content overflows
          }}
        >
          {children}
        </Box>
      </Popover>
    </>
  );
};

export { JumboDdPopover };

JumboDdPopover.propTypes = {
  children: PropTypes.node.isRequired,
  triggerButton: PropTypes.node.isRequired,
  sx: PropTypes.object, // Assuming sx is an object (you can adjust the type as needed)
};
