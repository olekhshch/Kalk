import React from "react";
import useAppState from "../../state/useAppState";
import ButtonAction from "../../components/ButtonAction";
import ScaleDialog from "./ScaleMenu";

const BottomPanel = () => {
  const { scale, show_scale_menu, openScaleMenu, hideScaleMenu } =
    useAppState();

  const toggleScaleDialog = () => {
    console.log(show_scale_menu);
    show_scale_menu ? hideScaleMenu() : openScaleMenu();
  };

  return (
    <div className="bg-main px-2 text-white font-sys">
      <div>
        <ButtonAction
          title={`${scale * 100}%`}
          showIcon={false}
          onClick={toggleScaleDialog}
        />
        {show_scale_menu && <ScaleDialog />}
      </div>
    </div>
  );
};

export default BottomPanel;
