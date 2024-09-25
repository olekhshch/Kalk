import { useShallow } from "zustand/react/shallow";
import useUI from "../../../hooks/useUI";
import CreateComponent from "./CreateComponent";
import BigButton from "./BigButton";

const ContextMenu = () => {
  const [, components, targetId, position, comment] = useUI(
    useShallow((store) => [
      store.contextMenu,
      store.contextMenuContent.components,
      store.contextMenuContent.id,
      store.contextMenuContent.position,
      store.contextMenuContent.comment,
    ])
  );

  const closeContext = useUI(useShallow((store) => store.closeContext));

  const openCommentField = useUI(
    useShallow((store) => store.openNodeCommentField)
  );

  const openCommentHandler = () => {
    console.log("CLICK");
    if (targetId) {
      openCommentField(targetId);
    }
    closeContext();
  };

  return (
    <div
      className="fixed bg-white shadow-lg flex flex-col overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "180px",
      }}
    >
      {components.map((component) => {
        switch (component) {
          case "creator":
            return <CreateComponent key={component} />;
          case "node-comment": {
            return (
              <BigButton onClick={openCommentHandler} key={component}>
                <span>{comment ? "Edit comment" : "Add comment"}</span>
              </BigButton>
            );
          }
        }
      })}
    </div>
  );
};

export default ContextMenu;
