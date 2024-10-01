import React, { useEffect } from "react";
import NodeWrapper from "./NodeWrapper";
import {
  Matrix,
  ResultNode as ResultNodeType,
  Vector,
} from "../../types/nodes";
import Input from "../ports/Input";
import { NodeProps } from "@xyflow/react";
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";
import Latex from "react-latex-next";
import getValueType from "../../utils/getValueType";

const ResultNode = ({
  id,
  data: { comment, isShown, valueId },
}: NodeProps<ResultNodeType>) => {
  const value = useContent(useShallow((store) => store.values[valueId]));

  useEffect(() => console.log("RES RERENDERED"));
  // if (!isShown) {
  //   return null;
  // }
  return (
    <>
      <NodeWrapper id={id} comment={comment ?? null}>
        <div className="p-2">
          <Input cssPosition="50%" label="R" id="R" />
          <Latex>{resultLateX(value)}</Latex>
        </div>
      </NodeWrapper>
    </>
  );
};

function resultLateX(value: number | Matrix | Vector | null) {
  let str = "";
  const valueType = getValueType(value);

  if (!valueType) return str;

  if (Array.isArray(value)) {
    // checking if Matrix or Vector
    switch (Array.isArray(value[0])) {
      case true: {
        // value is Matrix
        (value as Matrix).forEach((row) => {
          row.forEach((num, idx) => {
            const fixedNum = num.toFixed(3);
            str += fixedNum;
            if (idx !== row.length - 1) {
              str += " & ";
            } else {
              str += "\\\\";
            }
          });
        });

        str = `$\\begin{bmatrix} ${str} \\end{bmatrix}$`;
        break;
      }
      default: {
        // value is Vector
        const valueFixed = (value as Vector).map((num) => num.toFixed(3));
        str = valueFixed.join(" \\\\ ");
        str = `$\\begin{pmatrix} ${str} \\end{pmatrix}$`;
      }
    }
  } else if (value !== null) {
    // #TODO: Fix when passed undefined
    str = `$${value ? value.toFixed(3) : value}$`;
  }

  return str;
}

export default React.memo(ResultNode);
