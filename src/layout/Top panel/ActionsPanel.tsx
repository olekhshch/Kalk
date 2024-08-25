import React, { useMemo } from "react";
import actions from "../../state/actions";
import useAppState from "../../state/useAppState";
import { Action } from "../../types/system";
import Button from "../../components/Button";

const ActionsPanel = () => {
  const { active_tab } = useAppState();

  //#TODO: Filtering all actions depending on the active tab

  const actionList = useMemo<Action[]>(() => {
    if (active_tab !== "All") {
      return Object.values(actions[active_tab]!);
    }

    return Object.values(actions).flat();
  }, [active_tab]);

  return (
    <div className="bg-sec px-2 pt-2 h-[72px] text-sm text-black flex flex-col flex-wrap content-start">
      {actionList.map(({ title, icon }) => (
        <Button
          key={title}
          title={title}
          icon={icon}
          activeStyle="main"
          showIcon
        />
      ))}
    </div>
  );
};

export default ActionsPanel;
