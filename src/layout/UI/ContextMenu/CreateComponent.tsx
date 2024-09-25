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
        <ActionList filter={debouncedSearch} />
      </ul>
    </div>
  );
};

type p = {
  filter: string;
};
const ActionList = ({ filter }: p) => {
  const actionsEntries = Object.entries(actions);

  const list = actionsEntries.reduce((acc, [tab, actions]) => {
    const items: AItem[] = actions.map((action) => ({
      tab,
      label: action.title,
      command: action.command,
    }));
    acc.push(...items);
    return acc;
  }, [] as AItem[]);

  if (filter.trim().length > 0) {
    return list
      .filter((aitem) =>
        aitem.label.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
      )
      .map((aitem) => <ActionItem key={aitem.command.data} {...aitem} />);
  }
  return list.map((aitem) => (
    <ActionItem key={aitem.command.data ?? aitem.label} {...aitem} />
  ));
};

type AItem = {
  label: string;
  tab: string;
  command: { type: "create" | "action"; data?: NodeType | ActionType };
};
const ActionItem = (params: AItem) => {
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
