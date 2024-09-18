import React from "react";

const HyperlinkCellRenderer = (props) => {
  const handleClick = () => {
    console.log("clicked");
    if (props.onClick) {
      props.onClick(props);
    }
  };

  return (
    <button
      className="btn text-accent btn-link cursor-pointer"
      onClick={handleClick}
    >
      {props.value}
    </button>
    // <a href="#" onClick={handleClick} className=''>
    //   {props.value}
    // </a>
  );
};

export default HyperlinkCellRenderer;
