import React, { useState } from "react";
import ConfirmationBox from "./ConfirmationBox";

function ConfirmationWrapper({ onConfirm, children, confirmationMessage }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (e) => {
    e.preventDefault()
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  const handleConfirm = (e) => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      {React.cloneElement(children, { onClick: openModal })}
      <ConfirmationBox
        isOpen={isOpen}
        title={"Confirm"}
        message={confirmationMessage || "Are you sure you want to proceed?"}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </>
  );
}
export default ConfirmationWrapper;
