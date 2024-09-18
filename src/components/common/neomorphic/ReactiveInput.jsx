import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";

import PaperAirplaneIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";

function ReactiveInput({
  onSubmit,
  value = "",
  placeholder = "",
  id,
  children,
  loading = false,
}) {
  console.log("comment", value);
  const inputRef = useRef(null);
  const [myvalue, setMyValue] = useState(value);

  function onEnter(event) {
    // event.preventDefault()
    if (event.key === "Enter") {
      console.log("onEnter", myvalue);
      onSubmit(myvalue);
    }
  }

  useEffect(() => {
    setMyValue(value);
  }, [value]);

  useEffect(() => {
    setFocusToInput();
  }, []);

  const setFocusToInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="input-group">
      <input
        ref={inputRef}
        type="text"
        placeholder="Write here"
        className="join-item input w-full"
        onKeyDown={onEnter}
        value={myvalue}
        onChange={(e) => setMyValue(e.target.value)}
      />
      <Button
        className="gap-2 join-item"
        loading={loading}
        onClick={(e) => {
          onSubmit(myvalue);
          setMyValue("");
        }}
      >
        <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
        Comment
      </Button>
      {children}
    </div>
  );
}

export default ReactiveInput;
