import * as React from "react";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Div } from "@jumbo/shared";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import {
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { authUser } from "./data";
import { JumboDdPopover } from "@jumbo/components/JumboDdPopover";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { getCookieValue } from "@jumbo/utilities/cookies";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const AuthUserPopover = () => {
  const { theme } = useJumboTheme();
  const { logout, accessToken, isAuthenticated, loading } = useAuth();

  let authenticatedUser;

  if (isAuthenticated) {
    authenticatedUser = getCookieValue("auth-user")?.user;
  }

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    if (!isAuthenticated) return navigate("/auth/login");
  }

  async function handlerChangePassword() {
    return navigate("/change-password");
  }

  async function handleViewers() {
    return navigate("/admin/users-management");
  }

  async function handleTags() {
    return navigate("/admin/tags-management");
  }

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <Avatar
            src={<PersonOutlineIcon />}
            sizes={"small"}
            sx={{
              boxShadow: 23,
              cursor: "pointer",
              backgroundColor: "primary.main",
            }}
          />
        }
        sx={{ ml: 3 }}
      >
        <Div
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            p: (theme) => theme.spacing(2),
          }}
        >
          <Avatar
            src={<PersonOutlineIcon />}
            // alt={authUser.name}
            sx={{
              width: 60,
              height: 60,
              mb: 2,
              backgroundColor: "primary.main",
            }}
          />
          <Typography variant={"h5"}>{authenticatedUser?.name}</Typography>
          <Typography variant={"body1"} color="text.secondary">
            {authenticatedUser?.email}
          </Typography>
          <Typography variant={"body1"} color="text.secondary">
            {authenticatedUser?.role}
          </Typography>
        </Div>
        <Divider />
        <nav>
          <List disablePadding sx={{ pb: 1, pl: 1, pr: 3 }}>
            {authenticatedUser?.role === "ADMIN" && (
              <>
                <ListItemButton onClick={handleViewers}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Users" sx={{ my: 0 }} />
                </ListItemButton>
                <ListItemButton onClick={handleTags}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocalOfferOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Tags" sx={{ my: 0 }} />
                </ListItemButton>
              </>
            )}

            <ListItemButton onClick={handlerChangePassword}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LockOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Change Password" sx={{ my: 0 }} />
            </ListItemButton>
            <ListItemButton onClick={handleLogout} loading={loading}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ my: 0 }} />
            </ListItemButton>
          </List>
        </nav>
      </JumboDdPopover>
    </ThemeProvider>
  );
};

export { AuthUserPopover };
