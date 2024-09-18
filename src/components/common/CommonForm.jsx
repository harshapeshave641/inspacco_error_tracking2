import { useEffect, useState } from "react";
import { splitArray } from "../../helpers/utils";
import DynamicField from "./DynamicField";
import Separator from "./Separator";
// import Button from "./neomorphic/Button";z

function Field({ field, editMode = true }) {
  if (editMode) return <DynamicField field={field} />;
  let value = field.value || "N/A";
  if (Array.isArray(value)) {
    value = value.map((a) => (typeof a === "string" ? a : a?.label)).join(",");
  } else if (typeof value === "object" && value.label) {
    value = value?.label;
  }
  return (
    <div>
      <label className="pb-1 text-xs font-medium label-text text-accent">
        {field.label}
      </label>
      <div className="form-control">{value}</div>
    </div>
  );
}
const CommonForm = ({
  formData,
  onSubmit,
  onClear,
  cols = 1,
  className = "",
  btnClasses = "",
  editMode = true,
  showButton = true,
  submitText = "Submit",
  disabled = false,
}) => {
  const [edit, setEdit] = useState(editMode);
  // console.log('')
  const array = splitArray(formData || [], cols);
  const [errros, setErrors] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    const mandatoryFields = formData.filter((a) => a.required && !a.value);
    if (mandatoryFields.length > 0) {
      setErrors(
        mandatoryFields?.map((a) => {
          return `${a.label} is Mandatory`;
        })
      );
    } else {
      setErrors([]);
      onSubmit();
    }
  }
  return (
    <form
      className={`form-control sm:w-full md:w-full  mx-6 ${className}`}
      onSubmit={handleSubmit}
    >
      <div
        className={` ${
          cols == 1 ? " flex justify-center " : "flex justify-evenly"
        }`}
      >
        {array?.map((arr) => (
          <div className={cols == 1 ? "w-2/3" : `mr-4 w-1/${cols}`}>
            {arr.map((obj) => {
              if (obj.type === "SEPERATOR") {
                console.log("obj", obj);
                return <Separator>{obj.label}</Separator>;
              } else {
                return <Field field={obj} editMode={edit} />;
              }
            })}
          </div>
        ))}
      </div>
      {showButton && (
        <div
          className={`mt-6 ${btnClasses} ${
            cols == 1 ? "" : "flex justify-center pt-4"
          }`}
        >
          {edit ? (
            <button
              type="submit"
              disabled={disabled}
              className="gap-1 mr-2 text-white btn btn-accent btn-sm"
            >
              {submitText}
            </button>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setEdit(true);
                }}
                className="gap-1 mr-2 btn btn-sm"
              >
                Edit
              </button>
              {onClear && (
                <Button type="ghost" className="gap-1 btn-sm" onClick={onClear}>
                  Clear
                </Button>
              )}
            </>
          )}
          {/* <Button className="gap-1 mr-2 btn-sm" onClick={handleSubmit}>
          Submit
        </Button> */}
        </div>
      )}
      {errros?.length ? (
        <div>
          <ol>
            {errros.map((err, index) => {
              return (
                <li className="text-red-400" key={index}>
                  {err}
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </form>
  );
};
export default CommonForm;
