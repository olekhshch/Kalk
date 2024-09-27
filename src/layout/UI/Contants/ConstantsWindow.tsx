import React, { useEffect } from "react";
import useConstants from "../../../hooks/useConstants";
import { useShallow } from "zustand/react/shallow";
import SortingTable from "../../../components/table/SortingTable";
import { FilterOptions, TableItem } from "../../../types/app";
import { invoke } from "@tauri-apps/api/core";
import ButtonMain from "../../../components/dialogs/ButtonMain";
import { emit } from "@tauri-apps/api/event";

const ConstantsWindow = () => {
  const [constants, initLoad] = useConstants(
    useShallow((store) => [store.constants, store.loadFromLS])
  );

  useEffect(() => {
    // initial loading of constants from app state
    initLoad();
  }, []);

  const openConstCreator = () => {
    invoke("open_new_constant_window");
  };

  // converting constants to table items to display
  const tableColumns: string[] = ["Name", "Label", "Value", "Type"];
  // const constItems: TableItem[] = constants.map((c) => [
  //   c.name,
  //   c.viewLabel,
  //   JSON.stringify(c.value),
  //   c.valueType,
  // ]);
  const constItems: TableItem[] = constants.map((c) => ({
    content: [c.name, c.viewLabel, JSON.stringify(c.value), c.valueType],
    onClick: () => {
      console.log(c.id);
      invoke("emit_const_picked_event", { constId: c.id }).catch((err) =>
        console.log({ err })
      );
    },
  }));

  const tableFilters = {
    Name: FilterOptions.TEXT,
    Label: FilterOptions.NONE,
  };

  const columnStyles = [null, { latex: true }, null, null];

  return (
    <div className="p-2 bg-white h-screen w-screen">
      <p>Choose a constant from the list to place it on canvas:</p>
      <div className="p-2 border-gray border-solid border-[1px] w-full rounded-strd min-w-fit">
        <SortingTable
          cursor="pointer"
          columns={tableColumns}
          items={constItems}
          filters={tableFilters}
          minWidths={{ Value: 200 }}
          columnStyles={columnStyles}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <ButtonMain onClick={openConstCreator}>
          <span>New const</span>
        </ButtonMain>

        <button>Cancel</button>
      </div>
    </div>
  );
};

export default ConstantsWindow;
