import { useMemo } from "react";
import actions from "../../state/config/actions";
import useAppState from "../../state/useAppState";
import { Action } from "../../types/app";
import Button from "../../components/Button";
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";

const ActionsPanel = () => {
  const { active_tab, setMode } = useAppState();
  const doAction = useContent(useShallow((store) => store.doAction));

  const actionList = useMemo<Action[]>(() => {
    if (active_tab !== "All") {
      return Object.values(actions[active_tab]!);
    }

    return Object.values(actions).flat();
  }, [active_tab]);

  const clickHandler = (action: Action) => {
    const {
      command: { type, data },
    } = action;
    switch (type) {
      case "create": {
        setMode("create", data);
        break;
      }
      case "action": {
        if (data) {
          doAction(data);
        }
      }
    }
  };

  return (
    <div className="bg-sec px-2 pt-2 h-[73px] text-sm text-black flex flex-col flex-wrap content-start">
      {actionList.map((action) => (
        <Button
          key={action.title}
          title={action.title}
          icon={action.icon ?? ""}
          large={action.large}
          hoverStyle="main"
          onClick={() => clickHandler(action)}
          hideTitle={action.hideToolbarTitle}
          showIcon={action.icon !== null}
        />
      ))}
    </div>
  );
};

export default ActionsPanel;
