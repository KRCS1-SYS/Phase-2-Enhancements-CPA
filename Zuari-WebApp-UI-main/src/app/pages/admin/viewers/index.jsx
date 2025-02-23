import React from "react";
import { ViewerList } from "@app/_components/admin/viewer/ViewersList";
// import Loader from "@app/_components/admin/viewer/ViewersList/components/ViewerListLoader/ViewerListLoader";
import { ViewerListLoader } from "@app/_components/admin/viewer/ViewersList/components/ViewerListLoader/ViewerListLoader";
import { Typography } from "@mui/material";
import { PageHeader } from "@app/_components/layout/Header/components/PageHeader/PageHeader";
import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { ContentLayout } from "@app/_layouts/ContentLayout";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Container, Stack, useMediaQuery } from "@mui/material";
import { Button } from "@mui/material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks";
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

const ViewersPage = () => {
  const contactLayoutConfig = useContactLayout();
  const { theme } = useJumboTheme();
  const lg = useMediaQuery(theme.breakpoints.down("lg"));
  const previousUsers = React.useRef(null);
  const { loading, getUsers, users } = useAuth();

  React.useEffect(() => {
    if (!users) {
      // apiCalled.current=true
      const fetchUsers = async () => {
        try {
          await getUsers();
          previousUsers.current = users;
        } catch (error) {
          console.error("Failed to fetch sugar areas:", error);
        }
      };
      fetchUsers();
    }
  }, [users]);

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
        header={<HomeNavigator title="Manage Users" />}
        {...contactLayoutConfig}
      >
        {/* <ViewerListLoader/> */}
        {loading && <ViewerListLoader />}
        {users ? (
          <ViewerList users={users} />
        ) : (
          <Typography
            variant={"body1"}
            sx={{ marginInline: "auto", marginY: "1rem", fontSize: "1.2rem" }}
          >
            No data found for the viewers{" "}
          </Typography>
        )}
      </ContentLayout>
    </Container>
  );
};
export default ViewersPage;
