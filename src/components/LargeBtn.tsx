import LateXformula from "./LateXformula";
import { ActionToolbar, ActionType } from "../types/app";
import useContent from "../state/useContent";
import { useShallow } from "zustand/react/shallow";
import useAppState from "../state/useAppState";

type props = {
  action: ActionToolbar;
};
const LargeBtn = ({
  action: { title, icon, iconType, hideTitle, command },
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
      className="main-bg-hover px-1 rounded-strd flex flex-col items-center hover:text-white h-full justify-between"
      onClick={onClick}
    >
      {iconType === "latex" ? (
        <div className="m-auto">
          <LateXformula value={icon} />
        </div>
      ) : (
        <img src={icon} alt={title} />
      )}
      {!hideTitle && <span>{title}</span>}
    </button>
  );
};

export default LargeBtn;
