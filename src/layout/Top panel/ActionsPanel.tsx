import React, { useMemo } from "react";
import actions from "../../state/actions";
import useAppState from "../../state/useAppState";
import { Action } from "../../types/system";
import Button from "../../components/Button";
import useContent from "../../state/useContent";

const ActionsPanel = () => {
  const { active_tab } = useAppState();
  const { doAction } = useContent();

  const actionList = useMemo<Action[]>(() => {
    if (active_tab !== "All") {
      return Object.values(actions[active_tab]!);
    }

    return Object.values(actions).flat();
  }, [active_tab]);

  return (
    <div className="bg-sec px-2 pt-2 h-[73px] text-sm text-black flex flex-col flex-wrap content-start">
      {actionList.map(({ title, icon, command }) => (
        <Button
          key={title}
          title={title}
          icon={icon}
          hoverStyle="main"
          onClick={() => doAction(command ?? title)}
          showIcon
        />
      ))}
    </div>
  );
};

export default ActionsPanel;
