import React from "react";
import { Mode } from "../../types/app";
import { modeData } from "../../state/useAppState";

type props = {
  mode: { current: Mode; data?: modeData };
};
const Tips = ({ mode: { current, data } }: props) => {
  switch (current) {
    case "create": {
      return (
        <span>
          <b>{data?.type}</b>: click on canvas to place the node | <b>Esc</b> to
          cancel{" "}
        </span>
      );
    }
    default: {
      return <span>{current}</span>;
    }
  }
};

export default React.memo(Tips);
