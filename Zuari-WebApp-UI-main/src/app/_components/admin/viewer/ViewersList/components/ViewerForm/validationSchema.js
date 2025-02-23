import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is reuired").min(8,"Password must be at least 8 characters"),
  confirmPassword: Yup.string().required("Confirm Password is reuired").oneOf([Yup.ref("password"), null], "Passwords must match"),
});
