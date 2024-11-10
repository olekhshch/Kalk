import UIBg from "../UIBg";
import useUI from "../../../hooks/useUI";
import { useShallow } from "zustand/react/shallow";
import ButtonMain from "../../../components/dialogs/ButtonMain";
// import SortingTable from "../../../components/table/SortingTable";
import useContent from "../../../state/useContent";
import MenuTable from "../../../components/table/MenuTable";
import { useMemo, useState } from "react";
import { TableItem } from "../../../types/app";
import makeValueId from "../../../utils/makeValueId";

const NodesOverview = () => {
  const close = useUI(useShallow((store) => store.closeNodeOverview));
  const nodes = useContent(useShallow((store) => store.nodes));
  const values = useContent(useShallow((store) => store.values));

  const [withResultNodes, setWithResultNodes] = useState(false);

  const numOfAllNodes = nodes.length;

  const headerColumns: string[] = ["ID", "Node Type", "Value"];

  const nodeItems: TableItem[] = useMemo(() => {
    let nodesToShow = nodes;

    if (!withResultNodes) {
      nodesToShow = nodesToShow.filter((node) => node.type !== "result");
    }

    return nodesToShow.map((node) => {
      const nodeOutputs = Object.keys(node.data.outputs);
      const valIds = nodeOutputs.map((outputLabel) =>
        makeValueId(node.id, outputLabel)
      );
      const nodeValues = valIds.map((valId) => {
        const value = values[valId];
        return JSON.stringify(value);
      });

      return {
        content: [
          { value: node.id },
          { value: node.type },
          { value: nodeValues },
        ],
      };
    }) as TableItem[];
  }, [nodes, values, withResultNodes]);

  return (
    <>
      <UIBg />
      <div className="ui-dialog-container w-full h-full fixed font-mono">
        <main className="dialog-main bg-white rounded-[8px] shadow-xl p-2">
          <title className="flex font-bold justify-between">
            <h1>Nodes</h1>
            <ButtonMain onClick={close}>
              <span>Close</span>
            </ButtonMain>
          </title>
          <section className="mb-2">
            <h2>Overview</h2>
            <p>
              <span>Overal nodes:</span> {numOfAllNodes}
            </p>
            <form className="flex gap-2">
              <input
                type="checkbox"
                value={withResultNodes ? "true" : "false"}
                onChange={() => setWithResultNodes(!withResultNodes)}
              />
              <label>Including nodes with results</label>
            </form>
          </section>
          <section>
            <MenuTable headerColumns={headerColumns} items={nodeItems} />
          </section>
        </main>
      </div>
    </>
  );
};

export default NodesOverview;
