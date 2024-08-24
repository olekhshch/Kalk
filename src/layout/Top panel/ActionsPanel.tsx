import React, { useMemo } from "react";
import actions from "../../state/actions";
import useAppState from "../../state/useAppState";
import { Action } from "../../types/system";
import ButtonAction from "../../components/ButtonAction";

const ActionsPanel = () => {
  const { active_tab } = useAppState();

  //#TODO: Filtering all actions depending on the active tab

  const actionList = useMemo<Action[]>(() => {
    return Object.values(actions).flat();
  }, []);

  return (
    <div className="bg-sec px-2 pt-2 h-[72px] text-sm text-black flex flex-col flex-wrap content-start">
      {actionList.map(({ title }) => (
        <ButtonAction key={title} title={title} />
      ))}
    </div>
  );
};

export default ActionsPanel;
