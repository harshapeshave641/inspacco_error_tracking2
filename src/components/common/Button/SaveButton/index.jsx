import React from "react";

export default function SaveButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="btn btn-sm capitalize active:border-none hover:bg-white px-6
       bg-white text-[#387193] rounded border-1 border-blue-950 font-bold"
    >
      {children}
    </button>
  );
}
