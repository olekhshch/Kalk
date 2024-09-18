import { invoke } from "@tauri-apps/api/core";
import {
  AppNode,
  ExpressionNode,
  IdentityMtxNode,
  Matrix,
  NumberFunctionParams,
} from "../types/nodes";
import {
  AngleFormat,
  CalculatedValues,
  RustCalculations,
} from "../types/system";
import convertToRAD from "./convertToRAD";
import convertToDEG from "./convertToDEG";
import makeIdentityMatrix from "./matrix/makeIdentityMatrix";

type f = (
  node: AppNode,
  values: CalculatedValues,
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
        if (
          angleFormat === AngleFormat.DEG &&
          node.data.trigonometry &&
          isNumber(val)
        ) {
          val = convertToRAD(val as number);
        }
        acc[key] = val as number;
        return acc;
      }, {} as NumberFunctionParams);

      if (!allValuesGiven) return values;

      let res = node.data.action(params);
      if (angleFormat === AngleFormat.DEG && node.data.isAngle) {
        res = convertToDEG(res as number);
      }
      newValues[node.id] = res;
      return newValues;
    }
    case "i-mtx": {
      const { sourceId } = (node as IdentityMtxNode).data.inputs.n;
      if (!sourceId) return values;

      const value = values[sourceId];

      if (!value && value !== 0) return values;

      if (!isNumber(value)) return values;

      const mtx = makeIdentityMatrix(value as number);

      newValues[node.id] = mtx;
    }
    default: {
      console.log("No calculation for " + node.type);
      return values;
    }
  }
};

const isNumber = (value: number | Matrix) => !Array.isArray(value);

export default calculateNode;
