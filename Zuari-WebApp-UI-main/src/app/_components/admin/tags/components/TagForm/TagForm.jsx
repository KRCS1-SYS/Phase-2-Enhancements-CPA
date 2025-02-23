import React from "react";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { validationSchema } from "./validationSchema";
import { Div } from "@jumbo/shared";
import { LoadingButton } from "@mui/lab";
import { useJumboDialog } from "@jumbo/components/JumboDialog/hooks/useJumboDialog";
import { IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import {
  AppBlocking,
  Tag,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks";
import {
  JumboAvatarField,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
  JumboCheckbox,
} from "@jumbo/vendors/react-hook-form";
import { object } from "prop-types";

const TagForm = ({ tag, dashboard }) => {
  const Swal = useSwalWrapper();
  const { hideDialog } = useJumboDialog();
  const { editTags } = useParameter();

  const [values, setValues] = React.useState({});
  const [formData, setFormData] = React.useState({});

  const addtag = () => {
    hideDialog();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "tag has been added successfully.",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const updatetag = async () => {
    await editTags(formData, tag.id, dashboard);
    hideDialog();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "tag has been updated successfully.",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const onHandleSave = async () => {
    await editTags(formData, tag?.TagId, dashboard);
    hideDialog();
    Swal.fire({
      position: "top-end",
      icon: "success",
         title: "Tag has been updated successfully.",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  function handleChange(e) {
    const { IsActive, Description, High, Low, TagName, MeasurementUnit } = e;
    setFormData({
      TagName,
      [dashboard === "sugar" ? "Unit" : "MeasurementUnit"]: MeasurementUnit,
      [dashboard === "sugar" ? "InstrumentDescription" : "ParameterName"]: Description,
      Low: Low === "" ? null : Low,
      High: High === "" ? null : High,
      IsActive,
    });
  }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  return (
    <JumboForm
      onSubmit={onHandleSave}
      onChange={handleChange}
      validationSchema={validationSchema}
    >
      <Div
        sx={{
          "& .MuiTextField-root": {
            mb: 3,
          },
        }}
      >
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
        <JumboCheckbox
          sx={{ mb: 2 }}
          fieldName="IsActive"
          label="Is Active"
          defaultChecked={tag?.IsActive}
          size={"small"}
        />
        <JumboInput
          fieldName="TagID"
          label="Tag ID"
          fullWidth
          defaultValue={tag?.TagId}
          size={"small"}
          disabled
        />
        <JumboInput
          fieldName="TagName"
          label="TagName"
          fullWidth
          defaultValue={tag?.TagName}
          onChange={handleChange}
          size={"small"}
        />
        <JumboInput
          fieldName={dashboard === "sugar" ? "Area" : "Associated Equipment"}
          label={dashboard == "sugar" ? "Area" : "Associated Equipment"}
          fullWidth
          defaultValue={
            dashboard == "sugar" ? tag?.Area : tag?.AssociatedEquipment
          }
          size={"small"}
          disabled
        />
        {dashboard == "power" && (
          <JumboInput
            fieldName="Section"
            label="Section"
            fullWidth
            defaultValue={tag?.Section}
            size={"small"}
            onChange={handleChange}
            disabled
          />
        )}
        {dashboard == "sugar" && (
          <JumboInput
            fieldName="ApplicationName"
            label="Application Name"
            fullWidth
            defaultValue={tag?.ApplicationName}
            size={"small"}
            disabled
          />
        )}
        <JumboInput
          fieldName="Description"
          label={
            dashboard == "sugar" ? "Instrument Description" : "Parameter Name"
          }
          fullWidth
          defaultValue={
            dashboard == "sugar"
              ? tag?.InstrumentDescription
              : tag?.ParameterName
          }
          size={"small"}
          onChange={handleChange}
        />
        <JumboInput
          fieldName={dashboard == "sugar" ? "IOType" : "SignalType"}
          label={dashboard == "sugar" ? "IO Type" : "Signal Type"}
          fullWidth
          defaultValue={dashboard == "sugar" ? tag?.IOType : tag?.SignalType}
          size={"small"}
          disabled
        />
        <JumboInput
          fieldName="MeasurementUnit"
          label="Measurement Unit"
          fullWidth
          defaultValue={tag?.Unit}
          size={"small"}
        />
        <JumboInput
          fieldName="Min"
          label="Minimum Range"
          fullWidth
          defaultValue={tag?.MinimumRange}
          size={"small"}
          disabled
        />
        <JumboInput
          fieldName="Max"
          label="Maximum Range"
          fullWidth
          defaultValue={tag?.MaximumRange}
          size={"small"}
          disabled
        />
        <JumboInput
          fieldName="Low"
          label="Low"
          fullWidth
          defaultValue={tag?.Low !== null ? tag.Low : ""}
          size={"small"}
        />
        <JumboInput
          fieldName="High"
          label="High"
          fullWidth
          defaultValue={tag?.High !== null ? tag?.High : ""}
          size={"small"}
        />
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mb: 3 }}
        >
          Save
        </LoadingButton>
      </Div>
    </JumboForm>
  );
};
export { TagForm };
