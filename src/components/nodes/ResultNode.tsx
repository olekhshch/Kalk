import React from "react";
import NodeWrapper from "./NodeWrapper";
import { Matrix, ResultNode as ResultNodeType } from "../../types/nodes";
import Input from "../ports/Input";
import { NodeProps } from "@xyflow/react";
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";
import Latex from "react-latex-next";

const ResultNode = ({ id, data: { sourceId } }: NodeProps<ResultNodeType>) => {
  const value = useContent(useShallow((store) => store.values[sourceId]));

  return (
    <>
      <Input cssPosition="50%" label="R" id="R" />
      <NodeWrapper id={id}>
        <div className="p-2">
          <Latex>{resultLateX(value)}</Latex>
        </div>
      </NodeWrapper>
    </>
  );
};

function resultLateX(value: number | Matrix | null) {
  let str = "";

  if (Array.isArray(value)) {
    // checking if Matrix or Vector
    switch (Array.isArray(value[0])) {
      case true: {
        value.forEach((row) => {
          row.forEach((num, idx) => {
            str += num;
            if (idx !== row.length - 1) {
              str += " & ";
            } else {
              str += "\\\\";
            }
          });
        });

        str = `$\\begin{bmatrix} ${str} \\end{bmatrix}$`;
      }
    }
  } else if (value !== null) {
    str = `$${value}$`;
  }

  return str;
}

export default React.memo(ResultNode);
