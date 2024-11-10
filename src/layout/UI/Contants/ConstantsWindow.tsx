import { useEffect } from "react";
import useConstants from "../../../hooks/useConstants";
import { useShallow } from "zustand/react/shallow";
// import SortingTable from "../../../components/table/SortingTable";
import { TableItem } from "../../../types/app";
import { invoke } from "@tauri-apps/api/core";
import ButtonMain from "../../../components/dialogs/ButtonMain";
import { listen } from "@tauri-apps/api/event";
import MenuTable from "../../../components/table/MenuTable";

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
    // content: [c.name, c.viewLabel, JSON.stringify(c.value), c.valueType],
    content: [
      { value: c.name },
      { value: c.viewLabel, latex: true },
      { value: JSON.stringify(c.value) },
    ],
    onClick: () => {
      invoke("emit_const_picked_event", { constId: c.id }).catch((err) =>
        console.log({ err })
      );
    },
  }));

  useEffect(() => {
    // Updates list if new constant was created

    const unlisten = listen("const-created", () => {
      console.log({ localStorage });
      initLoad();
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  });

  return (
    <div className="p-2 bg-white h-screen w-screen">
      <p>Choose a constant from the list to place it on canvas:</p>
      <div className="p-2 border-gray border-solid border-[1px] w-full rounded-strd min-w-fit">
        {/* <SortingTable
          cursor="pointer"
          columns={tableColumns}
          items={constItems}
          filters={tableFilters}
          minWidths={{ Value: 200 }}
          columnStyles={columnStyles}
        /> */}
        <MenuTable headerColumns={tableColumns} items={constItems} />
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
