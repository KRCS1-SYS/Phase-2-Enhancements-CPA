import LoadingButton from "@mui/lab/LoadingButton";
import {
  JumboCheckbox,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from "@jumbo/vendors/react-hook-form";
import { validationSchema } from "../validation";
import { IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { Link } from "@jumbo/shared";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Alert from '@mui/material/Alert';

const LoginForm = () => {
  const { t } = useTranslation();
  const { authError, loading, accessToken, login, getUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
 
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { email, password } = e;
    setFormData({
      ...formData,
      [Object.keys(e)[0]]: email,
      [Object.keys(e)[1]]: password,
    });
  };

  async function handleLogin(formData, event){
    await login({
      email: formData.email,
      password: formData.password,
    });
    return navigate("/");
  }
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  return (
    <JumboForm
      validationSchema={validationSchema}
      onSubmit={handleLogin}
      onChange={handleChange}
    >
      <Stack spacing={3} mb={3}>
        <JumboInput
          fullWidth
          fieldName={"email"}
          label={t("login.email")}
          onChange={handleChange}
          // defaultValue="demo@example.com"
        />
        <JumboOutlinedInput
          fieldName={"password"}
          label={t("login.password")}
          type={values.showPassword ? "text" : "password"}
          margin="none"
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          defaultValue={formData.password}
        />
        {(authError) &&
              <Alert variant="filled" severity="error">
              {authError}
          </Alert>}                        
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          loading={loading}
        >
          {t("login.loggedIn")}
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };
