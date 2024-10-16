// layer of different windows and dialogs

import { useShallow } from "zustand/react/shallow";
import useUI from "../../hooks/useUI";
import ScaleMenu from "./ScaleMenu";
import ContextMenu from "./ContextMenu/ContextMenu";
import ColorPicker from "./ColorPicker";

const UILayer = () => {
  const { scale, context } = useUI(
    useShallow((store) => ({ scale: store.scale, context: store.contextMenu }))
  );
  return (
    <>
      {scale && <ScaleMenu />}
      {context && <ContextMenu />}
      {/* <ColorPicker includeTransaparent={true} /> */}
    </>
  );
};

export default UILayer;
