import React, { useEffect, useState } from "react";
import PlotBase from "../plots/PlotBase";
import {
  Handle,
  NodeProps,
  Position,
  useUpdateNodeInternals,
} from "@xyflow/react";
import {
  NodeInput,
  NodeInputs,
  PlotNode as PlotNodeType,
} from "../../types/nodes";
import generateHandleId from "../../utils/generateHandleId";
import PlotInput from "../ports/PlotInput";
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";

const PlotNode = ({
  id,
  data: { inputs, equations },
}: NodeProps<PlotNodeType>) => {
  const [plotSize, setPlotSize] = useState({ w: 560, h: 560 });

  // useEffect(() => console.log("PLOT render"));
  return (
    <div className="flex border-solid border-matrix border-[1px] rounded-[4px]">
      <InputSection inputs={inputs} nodeId={id} />
      <div style={{ width: plotSize.w + "px", height: plotSize.h + "px" }}>
        <PlotBase
          w={plotSize.w}
          h={plotSize.h}
          pan={false}
          equations={equations}
          viewBox={{ x: [-8, 8] }}
        />
      </div>
    </div>
  );
};

type pr = {
  inputs: NodeInputs;
  nodeId: string;
};

const InputSection = ({ inputs, nodeId }: pr) => {
  const updateNodeIntervals = useUpdateNodeInternals();

  const addEq = useContent(useShallow((store) => store.addEquation));
  const inputsEntries = Object.entries(inputs);
  const defStep = 100 / (inputsEntries.length + 2);

  useEffect(() => updateNodeIntervals(nodeId), [inputsEntries.length]);
  return (
    <section className="bg-sec-mtx min-w-[84px] flex flex-col">
      {inputsEntries.map(([label, input], idx) => {
        if (!input) return null;
        const inputId = generateHandleId(nodeId, label, input.allowedTypes);
        console.log({ inputId });
        const top = `${defStep * (1 + idx)}%`;
        return (
          <PlotInput key={label} style={{ top }} label={label} id={inputId} />
        );
      })}
      <PlotInput
        id={generateHandleId(nodeId, "plotFN", ["number"], "addEq")}
        label="f(x)"
        style={{ top: `${defStep * (1 + inputsEntries.length)}%` }}
      />
    </section>
  );
};

export default PlotNode;
