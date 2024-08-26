import React from "react";
import useContent from "../../state/useContent";

const Header = () => {
  const { nodes } = useContent();
  return (
    <div className="px-2 flex justify-between">
      <div>
        <button onClick={() => console.log({ nodes })}>Nodes state</button>
      </div>
      <div className="text-base">New file</div>
      <div>X</div>
    </div>
  );
};

export default Header;
