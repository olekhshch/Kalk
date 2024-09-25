import React from "react";

type props = {
  children: React.ReactNode;
  onClick: React.MouseEventHandler;
};
const BigButton = ({ children, onClick }: props) => {
  return (
    <button className="p-2 text-center w-100% hover:bg-gray" onClick={onClick}>
      {children}
    </button>
  );
};

export default BigButton;
