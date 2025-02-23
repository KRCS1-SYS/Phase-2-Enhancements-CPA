import { Div } from "@jumbo/shared";
import { Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";

const Footer = () => {
  return (
    <Div
      sx={{
        py: 2,
        px: { lg: 6, xs: 4 },
        borderTop: 2,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Div
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left side: Logo + Footer Text */}
        <Div sx={{ display: "flex", alignItems: "center" }}>
          {/* Logo */}
          <img
            src={"/assets/images/zuari_logo.png"}
            alt="Zuari Industries Logo"
            style={{ width: "auto", height: 25, marginRight: 8 }}
          />
          <Typography variant="body1" color="text.primary">
            Zuari Industries © {new Date().getFullYear()}
          </Typography>
        </Div>
        {/* Right side: KGT Logo + Developer Text */}
        <Div sx={{ display: "flex", alignItems: "center" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="h5"
              sx={{
                display: { xs: "none", sm: "block" },
                mb: 0,
                mr: 2,
                color: "text.primary",
              }}
            >
              Developed By:
            </Typography>
            {/* KGT Logo */}
            <img
              src={"/assets/images/logo.svg"} // Adjust path and file name
              alt="KGT Solutions Logo"
              style={{ width: "auto", height: 20 }}
            />
          </Stack>
        </Div>
      </Div>
    </Div>
  );
};

export { Footer };
