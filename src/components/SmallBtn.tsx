import { ActionToolbar, ActionType } from "../types/app";
import LateXformula from "./LateXformula";
import useContent from "../state/useContent";
import { useShallow } from "zustand/react/shallow";
import useAppState from "../state/useAppState";

type props = {
  action: ActionToolbar;
};
const SmallBtn = ({
  action: { title, iconType, icon, hideTitle, command, hideIcon },
}: props) => {
  const [doAction] = useContent(useShallow((store) => [store.doAction]));
  const setMode = useAppState(useShallow((store) => store.setMode));

  const onClick = () => {
    if (command.type === "create") {
      setMode("create", { type: command.data });
    } else if (command.type === "action") {
      doAction(command.data as ActionType);
    }
  };

  return (
    <button
      className="main-bg-hover px-1 rounded-strd flex gap-1 items-center hover:text-white min-w-[20px] justify-center"
      onClick={onClick}
    >
      {!hideIcon &&
        (iconType === "url" ? (
          <img src={icon} alt={title} />
        ) : (
          <LateXformula value={icon} />
        ))}
      {!hideTitle && <span>{title}</span>}
    </button>
  );
};

export default SmallBtn;
