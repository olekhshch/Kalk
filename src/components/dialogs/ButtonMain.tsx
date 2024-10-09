import React from "react";

type props = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
};
const ButtonMain = ({ children, onClick, disabled }: props) => {
  return (
    <button
      className="px-2 py-1 bg-main font-bold text-white disabled:bg-sec"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonMain;
