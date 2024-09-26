// Nodes tab of PO window

import React, { useMemo, useState } from "react";
import useProjectOverview from "../../hooks/useProjectOverview";
import { useShallow } from "zustand/react/shallow";
import { AppNode } from "../../types/nodes";

const Nodes = () => {
  const [nodes] = useProjectOverview(useShallow((store) => [store.nodes]));

  const [showResults, setShowResults] = useState(false);

  const filteredNodes = useMemo(() => {
    if (!showResults) return nodes.filter((node) => node.type !== "result");

    return nodes;
  }, [showResults]);
  return (
    <div>
      <article>
        <p>Nodes count: {nodes.length}</p>
        <NodesTable nodes={filteredNodes} />
      </article>
    </div>
  );
};

type pr = {
  nodes: AppNode[];
};
const NodesTable = ({ nodes }: pr) => {
  return (
    <table>
      <tr>
        <th>Id</th>
        <th>Tag</th>
        <th>Nature</th>
        <th>Value</th>
        <th>Reference</th>
        <th>Comment</th>
      </tr>
      {nodes.map((node) => (
        <NodeItem key={node.id} node={node} />
      ))}
    </table>
  );
};

const NodeItem = (props: { node: AppNode }) => {
  const { id, type, data } = props.node;
  const nodeValue = useProjectOverview(useShallow((store) => store.values[id]));

  return (
    <tr>
      <td>{id}</td>
      <td>{data.tag ?? "n/a"}</td>
      <td>{type}</td>
      <td>{nodeValue}</td>
    </tr>
  );
};

export default Nodes;
