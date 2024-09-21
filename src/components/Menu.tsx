import React from "react";

type props = {
  children: React.ReactNode;
  title?: string;
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  cssClasses?: string;
};
const Menu = ({ children, title, position, cssClasses }: props) => {
  // #TODO: Center if no position
  const cssPosition = position
    ? {
        ...position,
      }
    : {
        top: "50%",
        left: "50%",
      };

  return (
    <div
      className={`bg-main fixed rounded-[4px] ${cssClasses}`}
      style={{ ...cssPosition }}
    >
      {title && <p className="p-1 font-bold select-none">{title}</p>}
      {children}
    </div>
  );
};

export default Menu;
