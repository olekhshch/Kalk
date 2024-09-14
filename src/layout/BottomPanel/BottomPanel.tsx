import { useMemo } from "react";
import useAppState from "../../state/useAppState";
import Button from "../../components/Button";
import ScaleDialog from "./ScaleMenu";
import { BackgroundVariant, useViewport } from "@xyflow/react";
import ButtonMode from "../../components/ButtonMode";

const BottomPanel = () => {
  const {
    show_scale_menu,
    openScaleMenu,
    hideScaleMenu,
    grid_type,
    setGridType,
    mode,
  } = useAppState();

  const { zoom } = useViewport();

  // const vpScale = useMemo(() => {
  //   return `${(z)}`
  // },[zoom])

  const toggleScaleDialog = () => {
    show_scale_menu ? hideScaleMenu() : openScaleMenu();
  };

  const tipText = useMemo(() => {
    switch (mode.current) {
      case "create": {
        return "Click on canvas to place new node";
      }
      default: {
        return "";
      }
    }
  }, [mode.current]);

  return (
    <div className="bg-main px-2 text-white font-sys text-sm flex gap-2 items-center">
      <div>
        <Button
          title={`${(zoom * 100).toFixed(2)}%`}
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
      <div className="flex gap-1">
        <span>{mode.current}</span>
        <span>{tipText}</span>
      </div>
    </div>
  );
};

export default BottomPanel;
