import React from "react";
import CommonForm from "../../../components/common/CommonForm";
import { CLIENT_SETTING_LIST } from "../../../constants";

export default function ManageClientSetting({ activeSociety = {}, onChange }) {
  const [formData, setFormData] = React.useState(activeSociety?.settings || {});
  function handleSubmit() {
    console.log("DAta", formData);
    onChange(formData);
  }
  const settings = activeSociety?.settings || {};
  console.log("settings", settings);
  console.log("formData", formData);
  return (
    <div className="form-container">
      <CommonForm
        formData={CLIENT_SETTING_LIST?.map((field) => {
          return {
            ...field,
            value: formData[field.name],
            setData: (obj) => {
              console.log("obj", obj);
              setFormData((prevFormData) => {
                return { ...prevFormData, ...obj };
              });
            },
          };
        })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
