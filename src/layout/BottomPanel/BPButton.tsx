import React from "react";

type props = {
  children: React.ReactNode;
  onClick: React.MouseEventHandler;
  style?: string;
};
const BPButton = ({ children, onClick, style }: props) => {
  return (
    <button
      className={
        "px-1 hover:bg-sec hover:text-black transition rounded-strd" +
        " " +
        style
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default BPButton;
