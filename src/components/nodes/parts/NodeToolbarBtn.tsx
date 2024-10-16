import classNames from "classnames";
import React from "react";

type props = {
  children: React.ReactNode;
  isActive: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
};
const NodeToolbarBtn = ({ children, isActive, onClick, className }: props) => {
  const twClass = classNames(
    className,
    {
      "bg-gray": isActive,
    },
    "rounded-[4px] w-[1.5rem] h-[1.5rem] hover:bg-gray transition"
  );
  return (
    <button className={twClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default NodeToolbarBtn;
