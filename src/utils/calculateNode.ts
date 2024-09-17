import { invoke } from "@tauri-apps/api/core";
import { AppNode, ExpressionNode, NumberFunctionParams } from "../types/nodes";
import {
  AngleFormat,
  CalculatedValues,
  RustCalculations,
} from "../types/system";
import convertToRAD from "./convertToRAD";
import convertToDEG from "./convertToDEG";

type f = (
  node: AppNode,
  values: { [id: string]: number | null },
  angleFormat: AngleFormat
) => Promise<CalculatedValues>;

const calculateNode: f = async (node, values, angleFormat) => {
  const newValues = values;
  switch (node.type) {
    case "expression": {
      const { value } = (node as ExpressionNode).data;
      const resCalc = (await invoke("evaluate_expression", {
        expr: value,
      }).catch(
        () =>
          ({ success: false, res: "", msg: "Invoke error" } as RustCalculations)
      )) as RustCalculations;

      if (!resCalc.success) {
        console.log(resCalc.msg);
        newValues[node.id] = null;
      } else {
        newValues[node.id] = parseFloat(resCalc.res);
      }
      return newValues;
    }
    case "num-fun": {
      const inputEntries = Object.entries(node.data.inputs);
      let allSourcesGiven = true;

      const sourceIds = inputEntries.map(([key, { sourceId }]) => {
        if (!sourceId) {
          allSourcesGiven = false;
        }
        return [key, sourceId as string];
      });

      if (!allSourcesGiven) return values;
      let allValuesGiven = true;

      const params = sourceIds.reduce((acc, [key, id]) => {
        let val = values[id];
        if (!val && val !== 0) {
          allSourcesGiven = false;
          acc[key] = 0;
          return acc;
        }
        // convertation if trigonometric function and angle format = DEG
        if (angleFormat === AngleFormat.DEG && node.data.trigonometry) {
          val = convertToRAD(val);
          console.log(val);
          console.log(Math.PI);
        }
        acc[key] = val;
        return acc;
      }, {} as NumberFunctionParams);

      if (!allValuesGiven) return values;

      let res = node.data.action(params);
      if (angleFormat === AngleFormat.DEG && node.data.isAngle) {
        res = convertToDEG(res);
      }
      newValues[node.id] = res;
      return newValues;
    }
    default: {
      console.log("No calculation for " + node.type);
      return values;
    }
  }
};

export default calculateNode;
