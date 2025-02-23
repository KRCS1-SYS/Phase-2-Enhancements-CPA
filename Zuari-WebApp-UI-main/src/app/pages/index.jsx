import { NavigationCard } from "@app/_components/NavigationCard";
import { Div, Link } from "@jumbo/shared";
import { Container, Grid, Typography } from "@mui/material";
import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { ObjectCountQueries } from "@app/_components/StatusCard2";
import { statusCard } from "@app/_components/StatusCard2";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

const LandingPage = () => {
  const { logout, accessToken, authenticatedUser, isAuthenticated } = useAuth();

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
      <Grid container spacing={4}>
        <Grid item xs={12} lg={12}>
          <Typography
            variant={"h1"}
            fontWeight={"5000"}
            sx={{
              fontSize: { xs: "1.5rem", sm: "2.5rem" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Welcome to Plant Dashboard
          </Typography>
        </Grid>
        <Grid item xs={12} lg={6}>
          <NavigationCard
            title="Sugar"
            path="dashboard/sugar"
            description="Monitor critical parameters of the Sugar Plant in real-time to ensure operational efficiency and performance."
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <NavigationCard
            title="Power"
            path="dashboard/power"
            description="Track essential parameters of the Power Plant to ensure reliable operations."
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LandingPage;
