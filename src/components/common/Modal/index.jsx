import React from "react";
import Button from "../neomorphic/Button";
import { useEscapeKeyHandler } from "../../../helpers/escapeAcross";

export default function Modal({
  showModal,
  closeModal,
  title = "",
  children,
  submitBtnText = "Submit",
  fullscreen = false,
  type = "docked", 
  onSubmit,
  showBtns = true,
  className,
}){

useEscapeKeyHandler([
  {
    condition: () => showModal,
    action: closeModal
  },
])


  return (
    <div
      data-modal-backdrop="static"
      open={showModal}
      className={`modal ${
        type === "docked" ? "modal-bottom" : "modal-center"
      }  ${className} ${showModal ? "modal-open" : ""}`}
    >
      <div
        method="dialog"
        className={`modal-box pt-0 max-h-screen overflow-hidden ${
          type === "floating" ? "fixed top-[80px]" : "h-screen"
        } ${fullscreen ? "h-screen" : ""}`}
      >
        <button
          onClick={closeModal}
          className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
        >
          ✕
        </button>
        <h3 className="py-4 text-lg font-bold text-center border-b dark:border-gray-500">
          {title}
        </h3>
        <div
          className={`${
            fullscreen ? "max-h-content h-content" : "max-h-[73vh]"
          } pb-4 overflow-y-auto overflow-x-hidden`}
        >
          {children}
        </div>
        {showBtns ? (
          <div className={`modal-action ${!showBtns ? "h-10" : ""}`}>
            {showBtns && (
              <div>
                <Button onClick={onSubmit} type="accent">
                  {submitBtnText}
                </Button>{" "}
                &nbsp;&nbsp;
                <Button type="default" onClick={closeModal}>
                  Close
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
