import React from "react";

type props = {
  children: React.ReactNode;
  bottom: number;
};
const Menu = ({ children, bottom }: props) => {
  console.log(bottom);

  return (
    <div className={`bg-main fixed`} style={{ bottom: bottom }}>
      {children}
    </div>
  );
};

export default Menu;
