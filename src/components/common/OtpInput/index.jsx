import React from "react";

const OtpInput = ({
  size = 6,
  validationPattern = /[0-9]{1}/,
  value,
  onChange,
  className,
  wrapperClass,
  ...restProps
}) => {
  const handleInputChange = (e, index) => {
    const elem = e.target;
    const val = e.target.value;
    // check if the value is valid
    if (!validationPattern.test(val) && val !== "") return;

    // change the value of the upper state using onChange
    const valueArr = value.split("");
    valueArr[index] = val;
    const newVal = valueArr.join("").slice(0, 6);
    onChange(newVal);

    //focus the next element if there's a value
    if (val) {
      const next = elem.nextElementSibling;
      next?.focus();
    }
  };

  const handleKeyUp = (e) => {
    const current = e.currentTarget;
    if (e.key === "ArrowLeft" || e.key === "Backspace") {
      const prev = current.previousElementSibling;
      prev?.focus();
      prev?.setSelectionRange(0, 1);
      return;
    }

    if (e.key === "ArrowRight") {
      const prev = current.nextSibling;
      prev?.focus();
      prev?.setSelectionRange(0, 1);
      return;
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const val = e.clipboardData.getData("text").substring(0, size);
    onChange(val);
  };

  // Create an array based on the size.
  const arr = new Array(size).fill("-");
  return (
    <div className={`${wrapperClass}`}>
      <div className="flex justify-center items-center gap-2">
        {/* Map through the array and render input components */}
        {arr.map((_, index) => (
          <input
            key={index}
            {...restProps}
            autoFocus={index === 0}
            onChange={(e) => handleInputChange(e, index)}
            onKeyUp={handleKeyUp}
            onPaste={handlePaste}
            className={`${className} w-12 input input-bordered px-0 text-center`}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern={validationPattern.source}
            maxLength={6}
            value={value.at(index) ?? ""}
          />
        ))}
      </div>
    </div>
  );
};

export default OtpInput;
