import { LowPriority } from "@mui/icons-material";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  IsActive: Yup.boolean().required("Status is required"),
  TagName: Yup.string().required("Tag Name is required"),
  Description: Yup.string().required(
    "Instrument Description (Sugar) or Parameter Name (Power) is required"
  ),
  High: Yup.number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .typeError("High must be a numeric value")
    .notRequired(),

  Low: Yup.number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .typeError("Low must be a numeric value")
    .notRequired(),
  MeasurementUnit: Yup.string().required("Measurement Unit is required"),
});
