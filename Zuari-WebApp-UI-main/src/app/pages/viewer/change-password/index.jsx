import React from "react";
import { PageHeader } from "@app/_components/layout/Header/components/PageHeader/PageHeader";
import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { ContentLayout } from "@app/_layouts/ContentLayout";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Container, Stack, useMediaQuery } from "@mui/material";
import {Button} from "@mui/material"
import { ChangePasswordForm } from "@app/_components/auth/reset-password";
import { ASSET_AVATARS, ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { getAssetPath } from "@app/_utilities/helpers";
import { Div, Link } from "@jumbo/shared";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { getCookieValue } from "@jumbo/utilities/cookies";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  alpha,
} from "@mui/material";
import shadows from "@mui/material/styles/shadows";
import { useTranslation } from "react-i18next";
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

const ChangePassword = () => {
  const contactLayoutConfig = useContactLayout();
  const { theme } = useJumboTheme();
  const lg = useMediaQuery(theme.breakpoints.down("lg"));
  const { logout, accessToken,isAuthenticated, loading } = useAuth();

  let authenticatedUser;
  
  if(isAuthenticated){
    authenticatedUser= getCookieValue("auth-user")?.user
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
          <HomeNavigator title={"Change Password"} />
        }
        {...contactLayoutConfig}       
      >
        <Div
            sx={{
                flex: 1,
                flexWrap: "wrap",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: (theme) => theme.spacing(4),
            }}
            >
            <Card sx={{ maxWidth: "100%", width: 450, mb: 4 }}>
                <Div sx={{ position: "relative", height: "200px" }}>
                    <Div
                        sx={{
                        flex: 1,
                        inset: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // backgroundColor: (theme) =>
                        //     alpha(theme.palette.common.black, 0.5),
                        p: (theme) => theme.spacing(1),
                        }}
                    >
                        <Div
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                            >
                            <Avatar
                                src={<PersonOutlineIcon />}
                                sx={{
                                width: 70,
                                height: 70,
                                mb: 2,
                                backgroundColor: "primary.main",
                                }}
                            />
                            <Typography variant={"h3"}>{authenticatedUser?.name}</Typography>
                            <Typography variant={"body1"} color="text.secondary">
                                {authenticatedUser?.email}
                            </Typography>
                            <Typography variant={"body1"} color="text.secondary">
                                {authenticatedUser?.role}
                            </Typography> 
                        </Div>
                    </Div>
                </Div>
                <CardContent sx={{ pt: 0 }}>
                    <Div sx={{
                        mt: 4
                    }}>
                        <ChangePasswordForm />
                    </Div>
                </CardContent>
            </Card>      
         </Div>
      </ContentLayout>
    </Container>
  );
};
export default ChangePassword;