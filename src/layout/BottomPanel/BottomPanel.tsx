import React from "react";
import useAppState from "../../state/useAppState";
import Button from "../../components/Button";
import ScaleDialog from "./ScaleMenu";
import { BackgroundVariant } from "@xyflow/react";
import ButtonMode from "../../components/ButtonMode";

const BottomPanel = () => {
  const {
    scale,
    show_scale_menu,
    openScaleMenu,
    hideScaleMenu,
    grid_type,
    setGridType,
  } = useAppState();

  const toggleScaleDialog = () => {
    show_scale_menu ? hideScaleMenu() : openScaleMenu();
  };

  return (
    <div className="bg-main px-2 text-white font-sys text-sm flex gap-1 items-center">
      <div>
        <Button
          title={`${scale * 100}%`}
          showIcon={false}
          onClick={toggleScaleDialog}
          hoverStyle="sec"
        />
        {show_scale_menu && <ScaleDialog />}
      </div>
      <div className="flex items-center gap-[2px]">
        <ButtonMode
          title="Lines"
          activeStyling="sec"
          icon="grid-lines"
          isActive={grid_type === BackgroundVariant.Lines}
          onClick={() => setGridType(BackgroundVariant.Lines)}
          showIcon
        />

        <ButtonMode
          title="Cross"
          activeStyling="sec"
          icon="grid-cross"
          isActive={grid_type === BackgroundVariant.Cross}
          onClick={() => setGridType(BackgroundVariant.Cross)}
          showIcon
        />
        <ButtonMode
          title="Dots"
          activeStyling="sec"
          icon="grid-dots"
          isActive={grid_type === BackgroundVariant.Dots}
          onClick={() => setGridType(BackgroundVariant.Dots)}
          showIcon
        />
      </div>
    </div>
  );
};

export default BottomPanel;
