// layer of different windows and dialogs

import { useShallow } from "zustand/react/shallow";
import useUI from "../../hooks/useUI";
import ScaleMenu from "./ScaleMenu";
import ContextMenu from "./ContextMenu/ContextMenu";
import NodesOverview from "./NodeOverview/NodesOverview";

const UILayer = () => {
  const [scale, context, nodesOv] = useUI(
    useShallow((store) => [store.scale, store.contextMenu, store.nodesOverview])
  );
  return (
    <>
      {nodesOv && <NodesOverview />}
      {scale && <ScaleMenu />}
      {context && <ContextMenu />}
      {/* <ColorPicker includeTransaparent={true} /> */}
    </>
  );
};

export default UILayer;
