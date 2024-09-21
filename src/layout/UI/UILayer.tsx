// layer of different windows and dialogs

import { useShallow } from "zustand/react/shallow";
import useUI from "../../hooks/useUI";
import ScaleMenu from "./ScaleMenu";

const UILayer = () => {
  const { scale } = useUI(useShallow((store) => ({ scale: store.scale })));
  return <>{scale && <ScaleMenu />}</>;
};

export default UILayer;
