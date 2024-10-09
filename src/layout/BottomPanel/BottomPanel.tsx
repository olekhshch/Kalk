import useAppState from "../../state/useAppState";
import Button from "../../components/Button";
import { BackgroundVariant, useViewport } from "@xyflow/react";
import ButtonMode from "../../components/ButtonMode";
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";
import { AngleFormat } from "../../types/app";
import Tips from "./Tips";
import useUI from "../../hooks/useUI";

const BottomPanel = () => {
  const { grid_type, setGridType, mode, minimap, showHideMinimap } =
    useAppState();
  const { toggleScaleMenu } = useUI(
    useShallow((store) => ({
      toggleScaleMenu: (e: React.MouseEvent) => {
        e.stopPropagation();
        store.scale ? store.closeScale() : store.openScale();
      },
    }))
  );

  const { anglesFormat, toggleAngleFormat } = useContent(
    useShallow((store) => ({
      anglesFormat: store.anglesFormat,
      toggleAngleFormat: (oldFormat: AngleFormat) => {
        switch (oldFormat) {
          case "DEG": {
            store.setAnglesFormat("RAD");
            break;
          }
          default: {
            store.setAnglesFormat("DEG");
          }
        }
      },
    }))
  );

  const { zoom } = useViewport();

  const toggleMinimap = () => {
    showHideMinimap(!minimap);
  };

  // const tipText = useMemo(() => {
  //   switch (mode.current) {
  //     case "create": {
  //       return "Click on canvas to place new node";
  //     }
  //     default: {
  //       return "";
  //     }
  //   }
  // }, [mode.current]);

  return (
    <div className="bg-main px-2 text-white font-sys text-sm flex gap-2 items-center">
      <div>
        <Button
          icon=""
          title={`${(zoom * 100).toFixed(2)}%`}
          showIcon={false}
          onClick={(e) => toggleScaleMenu(e)}
          hoverStyle="sec"
        />
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
      <div className="flex gap-1 grow">
        <Tips mode={mode} />
      </div>
      <div className="flex">
        <ButtonMode
          activeStyling="sec"
          icon="minimap"
          title={minimap ? "Hide minimap" : "Show minimap"}
          onClick={toggleMinimap}
          isActive={minimap}
          showIcon
        />
        <Button
          icon=""
          title={anglesFormat}
          hoverStyle="sec"
          showIcon={false}
          onClick={() => toggleAngleFormat(anglesFormat)}
        />
      </div>
    </div>
  );
};

export default BottomPanel;
