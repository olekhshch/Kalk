import React from "react";
import useAppState from "../state/useAppState";

const BottomPanel = () => {
  const { scale } = useAppState();

  return <div className="bg-main text-white">{scale * 100}%</div>;
};

export default BottomPanel;
