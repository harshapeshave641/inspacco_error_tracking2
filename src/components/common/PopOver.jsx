import React, { useState, useRef } from "react";

/**
 * A React component that renders a popover with customizable content and position.
 *
 * @param {Object} props - The component's props.
 * @param {React.ReactElement} props.children - The element that triggers the popover.
 * @param {React.ReactNode} props.content - The content to be displayed in the popover.
 * @param {string} props.position - The position of the popover relative to the trigger element. Can be either 'top' or 'bottom'.
 *
 * @returns {React.ReactElement} - The rendered popover component.
 */
function Popover({ children, content, position }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="relative inline-block">
      {React.cloneElement(children, { onClick: handleOpen })}
      {isOpen && (
        <div
          className={`absolute  z-10 bg-base-100 shadow-lg rounded-lg px-4 py-2 ${
            position === "top" ? "mb-1" : "mt-1"
          } left-1/2 transform -translate-x-1/2`}
        >
          <div className="flex justify-between items-center">
            <button onClick={handleClose} className="close absolute " style={{top:0,right:10}}>
              X
            </button>
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

export default Popover;
