import LoadingButton from "@mui/lab/LoadingButton";
import { JumboForm, JumboOutlinedInput } from "@jumbo/vendors/react-hook-form";
import { validationSchema } from "../validation";
import { IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";
import Alert from "@mui/material/Alert";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";

const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const { changePassword, loading, isAuthenticated } = useAuth();
  const [values, setValues] = React.useState({
    old: { showPassword: false },
    new: { showPassword: false },
    confirm: { showPassword: false },
  });

  const [formData, setFormData] = React.useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { oldPassword, newPassword, confirmPassword } = e;
    setFormData({
      ...formData,
      [Object.keys(e)[0]]: oldPassword,
      [Object.keys(e)[1]]: newPassword,
      [Object.keys(e)[2]]: confirmPassword,
    });
  };

  const handleClickShowPassword = (key) => {
    setValues((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        showPassword: !prevState[key].showPassword,
      },
    }));
  };

  async function handleSubmit(formData, event) {
    await changePassword({
      old_password: formData.oldPassword,
      new_password: formData.newPassword,
    });
    isAuthenticated ? " " : navigate("/auth/login");
  }

  return (
    <JumboForm
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      onChange={handleChange}
    >
      <Stack spacing={3} mb={3} mt={0} pt={0}>
        <JumboOutlinedInput
          fieldName="oldPassword"
          label="Old Password"
          type={values.old.showPassword ? "text" : "password"}
          margin="none"
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("old")}
                edge="end"
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        />
        <JumboOutlinedInput
          fieldName="newPassword"
          label="New Password"
          type={values.new.showPassword ? "text" : "password"}
          margin="none"
          onChange={handleChange}
          // value={formData.newPassword}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("new")}
                edge="end"
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        />
        <JumboOutlinedInput
          fieldName="confirmPassword"
          label="Confirm Password"
          type={values.confirm.showPassword ? "text" : "password"}
          margin="none"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("confirm")}
                edge="end"
              >
                {values.confirm.showPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </InputAdornment>
          }
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        />
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          loading={loading}
        >
          {"Submit"}
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { ChangePasswordForm };
