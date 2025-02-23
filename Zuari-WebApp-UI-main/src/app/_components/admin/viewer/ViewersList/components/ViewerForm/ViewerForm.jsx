import React from "react";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { validationSchema } from "./validationSchema";
import { Div } from "@jumbo/shared";
import { LoadingButton } from "@mui/lab";
import { useJumboDialog } from "@jumbo/components/JumboDialog/hooks/useJumboDialog";
import { IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { Password, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import {
  JumboAvatarField,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from "@jumbo/vendors/react-hook-form";

const ViewerForm = ({ contact }) => {
  const { addUser } = useAuth();
  const Swal = useSwalWrapper();
  const { hideDialog } = useJumboDialog();

  const [values, setValues] = React.useState({
    new: { showPassword: false },
    confirm: { showPassword: false },
  });

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const addContact = () => {
    hideDialog();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Contact has been added successfully.",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const updateContact = () => {
    hideDialog();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Contact has been updated successfully.",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const onContactSave = () => {
    if (contact?.id) {
      updateContact();
    } else {
      addContact();
    }
  };

  const handleChange = (e) => {
    const { name, email, password } = e;
    setFormData({
      ...formData,
      [Object.keys(e)[0]]: name,
      [Object.keys(e)[1]]: email,
      [Object.keys(e)[2]]: password,
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
    await addUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    onContactSave();
  }

  return (
    <JumboForm
      onSubmit={handleSubmit}
      onChange={handleChange}
      validationSchema={validationSchema}
    >
      <Stack spacing={3} mb={3} mt={0} pt={0}>
        <JumboAvatarField
          fieldName={"profile_pic"}
          alt={"user profile pic"}
          sx={{
            width: 60,
            height: 60,
            margin: "0 auto 24px",
            cursor: "pointer",
          }}
          fullWidth
        />
        <JumboOutlinedInput
          fieldName="name"
          label="Name"
          fullWidth
          // sx={{mb:2, }}
        />
        <JumboOutlinedInput
          fieldName="email"
          label="Email"
          fullWidth
          // sx={{mt:3, }}
        />
        <JumboOutlinedInput
          fieldName={"password"}
          label={"Password"}
          fullWidth
          type={values.new.showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("new")}
                edge="end"
              >
                {values.new.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <JumboOutlinedInput
          fieldName={"confirmPassword"}
          label={"Confirm Password"}
          fullWidth
          type={values.confirm.showPassword ? "text" : "password"}
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
        />
        <LoadingButton fullWidth type="submit" variant="contained" size="large">
          Save
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};
export { ViewerForm };
