import React, { useEffect } from "react";

const ConfirmationBox = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  className = "",
  confirmDisabled,
}) => {
  const handleClose = (event) => {
    if (event.key === "Escape") onCancel();
  };

  useEffect(() => {
    if (isOpen) document.addEventListener("keyup", handleClose, false);
    else document.removeEventListener("keyup", handleClose, false);
  }, [isOpen]);

  return (
    <>
      <div
        className={`modal bg-blur-md ${isOpen ? "modal-open" : ""}`}
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div
          className={`modal-box rounded-xl ${className} fixed`}
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <p className="text-lg font-semibold">{title}</p>
          <p className="mt-2">{message}</p>
          <div className="modal-action">
            <button
              className="btn btn-sm btn-primary"
              onClick={onConfirm}
              disabled={confirmDisabled}
            >
              {confirmText}
            </button>
            <button className="btn btn-sm btn-ghost ml-2" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      {isOpen && <div className="modal-backdrop" onClick={onCancel}></div>}
    </>
  );
};

export default ConfirmationBox;
