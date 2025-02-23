import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Enter your Old password"),
    newPassword: Yup.string().required("Enter your New password").min(8,"Password must be at least 8 characters"),
    confirmPassword: Yup.string().required("Enter your Confirm password").oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
}); 
