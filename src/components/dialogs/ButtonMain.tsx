import React from "react";

type props = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
};
const ButtonMain = ({ children, onClick }: props) => {
  return (
    <button
      className="px-2 py-1 bg-main font-bold text-white"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonMain;
