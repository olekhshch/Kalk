import React from "react";
import actions from "../../../state/config/actions";
import MenuButton from "../../../components/MenuButton";
import { NodeType } from "../../../types/nodes";
import { ActionType } from "../../../types/app";
import useAppState from "../../../state/useAppState";
import { useShallow } from "zustand/react/shallow";
import useUI from "../../../hooks/useUI";
import useInputChange from "../../../hooks/useInputChange";
import { useDebounce } from "use-debounce";
import classNames from "classnames";

// Context Menu's block with app's actions
const CreateComponent = () => {
  const actionsEntries = Object.entries(actions);

  const [searchValue, onInputChange] = useInputChange({ initialValue: "" });

  const [debouncedSearch] = useDebounce(searchValue, 120);

  return (
    <div className="p-2 flex flex-col rounded-[8px]">
      <form className="flex justify-center m-1">
        <input
          className="px-1 max-w-full rounded-[4px]"
          value={searchValue}
          onChange={onInputChange}
          autoFocus
        />
      </form>
      <ul className="max-h-[160px] overflow-y-scroll border-b-2 border-sec">
        {actionsEntries.map(([key, actions]) => {
          let actionsToShow = actions;
          if (debouncedSearch.trim() !== "") {
            actionsToShow = actions.filter(({ title }) =>
              title.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
          }
          const actionItems = actionsToShow.map((action) => (
            <ActionItem
              key={action.title}
              label={action.title}
              command={action.command}
              tab={key}
            />
          ));
          return <>{...actionItems}</>;
        })}
      </ul>
    </div>
  );
};

const ActionItem = (params: {
  label: string;
  tab: string;
  command: { type: "create" | "action"; data?: NodeType | ActionType };
}) => {
  const { label, command, tab } = params;
  const [closeContextMenu] = useUI(useShallow((store) => [store.closeContext]));

  const [setMode] = useAppState(useShallow((store) => [store.setMode]));

  const onClick = () => {
    setMode(command.type === "action" ? "edit" : command.type, command.data);
    closeContextMenu();
  };

  return (
    <li className="text-sm">
      <MenuButton
        title={label + " | " + tab}
        onClick={onClick}
        cssClasses="hover:bg-gray p-1 px-2 text-ms"
      >
        <b>{label} | </b>{" "}
        <span
          className={classNames(
            tab === "Math" ? "text-number" : "text-vector",
            "text-xs"
          )}
        >
          {tab}
        </span>
      </MenuButton>
    </li>
  );
};

export default CreateComponent;
