import { AuthUserPopover } from "@app/_components/popovers/AuthUserPopover";
import { MessagesPopover } from "@app/_components/popovers/MessagesPopover";
import { NotificationsPopover } from "@app/_components/popovers/NotificationsPopover";
import { Typography } from "@mui/material";
import {
  useJumboLayout,
  useSidebarState,
} from "@jumbo/components/JumboLayout/hooks";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";

import { SIDEBAR_STYLES } from "@jumbo/utilities/constants";

import { Stack, useMediaQuery } from "@mui/material";
import React from "react";
import { Search, SearchIconButtonOnSmallScreen } from "./components";
import { TranslationPopover } from "@app/_components/popovers/TranslationPopover";
import { ThemeModeOption } from "./components/ThemeModeOptions";
import { Logo, SidebarToggleButton } from "@app/_components/_core";

function Header() {
  const { isSidebarStyle } = useSidebarState();
  const [searchVisibility, setSearchVisibility] = React.useState(false);
  const { headerOptions } = useJumboLayout();
  const { theme } = useJumboTheme();
  const isBelowLg = useMediaQuery(
    theme.breakpoints.down(headerOptions?.drawerBreakpoint ?? "xl")
  );
  const handleSearchVisibility = React.useCallback((value) => {
    setSearchVisibility(value);
  }, []);
  
  return (
    <React.Fragment>
      <Logo/>
      <Typography
            variant="h1"
            sx={{
              display: { xs: "none", sm: "block" },
              mb: 0,
              mr: 2,
              ml: 4,
              color: "primary.main",
              fontWeight: '700',
              fontSize: "2rem"
            }}
          >
            SPE Critical Parameter App
      </Typography>
      <Stack direction="row" alignItems="center" gap={1.25} sx={{ ml: "auto" }}>
        <AuthUserPopover />
      </Stack>
    </React.Fragment>
  );
}

export { Header };
