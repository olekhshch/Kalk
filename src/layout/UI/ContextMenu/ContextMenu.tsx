import { useShallow } from "zustand/react/shallow";
import useUI from "../../../hooks/useUI";
import CreateComponent from "./CreateComponent";

const ContextMenu = () => {
  const [isOpen, components, targetId, position] = useUI(
    useShallow((store) => [
      store.contextMenu,
      store.contextMenuContent.components,
      store.contextMenuContent.id,
      store.contextMenuContent.position,
    ])
  );

  return (
    <div
      className="fixed bg-white shadow-lg w-[220px]"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {components.map((component) => {
        switch (component) {
          case "creator":
            return <CreateComponent />;
        }
        return null;
      })}
    </div>
  );
};

export default ContextMenu;
