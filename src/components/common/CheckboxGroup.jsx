import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * A checkbox group component that allows multiple checkboxes to be selected.
 *
 * @param {Object} props - The component's props.
 * @param {Array} props.options - An array of objects representing the checkbox options. Each object should have a `label` and `value`.
 * @param {string} props.orientation - The orientation of the checkboxes. Can be either 'vertical' or 'horizontal'.
 * @param {Function} props.onChange - A callback function that is called when the checkbox selection changes. It receives an array of selected values.
 *
 * @returns {React.ReactElement} - The rendered checkbox group component.
 */
const CheckboxGroup = ({ options=[], orientation, onChange }) => {
  const [checkedValues, setCheckedValues] = useState([]);

  const handleCheckboxChange = (value) => {
    const updatedCheckedValues = checkedValues.includes(value)
      ? checkedValues.filter((v) => v !== value)
      : [...checkedValues, value];

    setCheckedValues(updatedCheckedValues);
    onChange(updatedCheckedValues);
  };

  return (
    <div
      className={`flex ${
        orientation === "horizontal" ? "flex-row" : "flex-col"
      }`}
    >
      {options.map((option) => (
        <label key={option.value} className="cursor-pointer label">
          <input
            type="checkbox"
            className="checkbox"
            value={option.value}
            onChange={() => handleCheckboxChange(option.value)}
          />
          <span className="label-text ml-2">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

CheckboxGroup.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  orientation: PropTypes.oneOf(["vertical", "horizontal"]),
  onChange: PropTypes.func.isRequired,
};

CheckboxGroup.defaultProps = {
  orientation: "vertical",
};



export default CheckboxGroup;
