import React from "react";

type props = {
  children: React.ReactNode;
  bottom: number;
};
const Dialog = ({ children, bottom }: props) => {
  return (
    <div className={`bg-main fixed`} style={{ bottom: bottom }}>
      {children}
    </div>
  );
};

export default Dialog;
