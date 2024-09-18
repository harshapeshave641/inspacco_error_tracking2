import React from "react";
function fn() {}
export default function Input({
  className,
  disabled,
  onChange,
  type = "text",
  placeholder = "",
  value = "",
  prefixIcon = false,
  name,
  id,
  helperText = "",
  iconWrapperClass = "",
  required = false,
  onKeyDown = fn,
  error,
  maxLength = Number.MAX_SAFE_INTEGER
}) {
  return (
    <div
      class="flex items-center justify-center w-full"
      onSubmit={(e) => {
        e.preventDefault();
        // onChange(value)
      }}
    >
      <div class="relative w-full">
        <div
          class={`absolute inset-y-0 left-0 top-2 pl-3 pointer-events-none ${iconWrapperClass}`}
        >
          {prefixIcon}
        </div>
        <input
          type={type}
          name={name}
          maxLength={maxLength}
          id={id}
          disabled={disabled}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className={`input text-accent input-bordered w-full ${
            prefixIcon ? "pl-11" : ""
          } ${
            error ? "input-error placeholder:text-red-500" : ""
          } ${className}`}
          value={value}
          placeholder={placeholder}
          required={required}
        />
        <div
          className={`${
            error ? "text-red-500 " : ""
          } text-left text-xs absolute z-[999] px-0.5 top-[-9px] left-[10px] bg-base-100 `}
        >
          {helperText || error}
        </div>
      </div>
    </div>
  );
}
