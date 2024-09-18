import React from "react";
import Datepicker from "react-tailwindcss-datepicker";

import Select from "../neomorphic/Select";
import Input from "../neomorphic/Input";
import Toggle from "../Toggle";
import moment from "moment";

function DynamicField({ field }) {
  const hideField = field.hide || false;
  if (hideField) return null;
  function renderField() {
    switch (field.type) {
      case "SELECT":
        return (
          <div>
            <label className="pb-1 text-xs font-medium label-text text-accent">
              {field.label}
            </label>
            <div className="form-control">
              <Select
                native={field.native}
                menuPortalTarget={field.menuPortalTarget}
                placeholder="Select"
                isClearable={Boolean(field.value)}
                compact
                className={
                  !field.native
                    ? field?.multiple
                      ? "select-sm w-full"
                      : "sm"
                    : "select-sm"
                }
                multiple={field.multiple}
                onChange={(value) => {
                  if (field.multiple) {
                    field.setData({ [field.name]: value });
                  } else {
                    field.setData({ [field.name]: value });
                  }
                }}
                value={!field.native ? field.value || null : field.value}
                options={field.options}
              />
            </div>
          </div>
        );
        break;
      case "TEXTAREA":
        return (
          <div>
            <label className="pb-1 text-xs font-medium label-text text-accent">
              {field.label}
            </label>
            <div className="form-control">
              <textarea
                type="text"
                value={field.value}
                required={field.required}
                onChange={({ target: { value } }) => {
                  field.setData({ [field.name]: value });
                }}
                placeholder={`Enter ${field.placeholder || field.label}`}
                className="h-6 textarea textarea-bordered textarea-xs"
              />
            </div>
          </div>
        );
        break;
      case "NUMBER":
        return (
          <div>
            <label className="pb-1 text-xs font-medium label-text text-accent">
              {field.label}
            </label>
            <Input
              type="number"
              required={field.required}
              value={field.value}
              onChange={({ target: { value } }) => {
                field.setData({ [field.name]: value });
              }}
              placeholder={`Enter ${field.label}`}
              className="input input-sm input-bordered"
            />
          </div>
        );
      case "BOOLEAN":
      case "SWITCH":
        return (
          <div className="flex items-center justify-start gap-2">
            {field.type === "SWITCH" && (
              <label className="pb-1 text-xs font-medium label-text text-accent">
                {field.leftLabel}
              </label>
            )}
            <Toggle
              // label={field.label}
              checked={field.value}
              className="toggle-success"
              size="sm"
              indeterminate={field.indeterminate}
              onChange={(checkedState) =>
                field.setData({ [field.name]: checkedState })
              }
            />
            <label className="pb-1 text-xs font-medium label-text text-accent">
              {field.type === "SWITCH" ? field.rightLabel : field.label}
            </label>
          </div>
        );
      case "DATE":
      case "DATERANGE":
        return (
          <div>
            {" "}
            <label className="pb-1 text-xs font-medium label-text text-accent">
              {field.label}
            </label>
            <Datepicker
              asSingle={field.type === "DATE"}
              value={field.value}
              theme={"light"}
              startFrom={
                field.startFrom || moment().subtract(1, "months").toDate()
              }
              maxDate={new Date()}
              inputClassName="text-xs h-8 input input-bordered w-52"
              containerClassName="w-52 h-8"
              popoverDirection={"down"}
              toggleClassName="invisible"
              onChange={({ startDate, endDate }) => {
                field.setData({ [field.name]: { startDate, endDate } });
              }}
              showShortcuts={false}
              primaryColor={"white"}
            />
          </div>
        );
      case "TEXT":
      default:
        return (
          <div>
            <label className="pb-1 text-xs font-medium label-text text-accent">
              {field.label}
            </label>
            <Input
              type="text"
              value={field.value}
              maxLength={field.maxLength}
              onChange={({ target: { value } }) =>
                field.setData({ [field.name]: value })
              }
              required={field.required}
              placeholder={`Enter ${field.label}`}
              className="input input-sm input-bordered"
            />
          </div>
        );
    }
  }

  return renderField();
}

export default DynamicField;
