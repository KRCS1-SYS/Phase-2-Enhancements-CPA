import { LoginForm } from "@app/_components/auth/login";
import { ASSET_AVATARS, ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { getAssetPath } from "@app/_utilities/helpers";
import { Div, Link } from "@jumbo/shared";
import { Facebook, Google, Twitter } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import shadows from "@mui/material/styles/shadows";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  return (
    <Div
      sx={{
        flex: 1,
        flexWrap: "wrap",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // p: (theme) => theme.spacing(4),
      }}
    >
      <Div sx={{ mb: 3, display: "inline-flex" }}>
          <img src={`${ASSET_IMAGES}/zuari_logo.png`} alt="Zuari Industry" />
      </Div>
      <Card sx={{ maxWidth: "100%", width: 360, mb: 4 }}>
        <Div sx={{ position: "relative", height: "200px" }}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="200"
            image={`${ASSET_IMAGES}/Sugar/sugar.jpeg`}
          />
          <Div
            sx={{
              flex: 1,
              inset: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette.common.black, 0.5),
              p: (theme) => theme.spacing(3),
            }}
          >
            <Typography
              variant={"h2"}
              sx={{
                color: "common.white",
                fontSize: "1.5rem",
                mb: 0,
              }}
            >
              {t("login.signIn")}
            </Typography>
          </Div>
        </Div>
        <CardContent sx={{ pt: 0 }}>
          <Div sx={{
            mt: 4
          }}>
            <LoginForm />
          </Div>
        </CardContent>
      </Card>
    </Div>
  );
}
