import React from "react";

type props = {
  children: JSX.Element;
};
const NodeWrapper = ({ children }: props) => {
  return <div className="border-sec border-solid">{children}</div>;
};

export default NodeWrapper;
