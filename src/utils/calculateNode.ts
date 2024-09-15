import { invoke } from "@tauri-apps/api/core";
import {
  AbsoluteNode,
  AdditionNode,
  AppNode,
  ExpressionNode,
  NumberFunctionParams,
  SubstractionNode,
} from "../types/nodes";
import { CalculatedValues, RustCalculations } from "../types/system";

type f = (
  node: AppNode,
  values: { [id: string]: number | null }
) => Promise<CalculatedValues>;

const calculateNode: f = async (node, values) => {
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
    case "add": {
      const { a, b } = (node as AdditionNode).data.inputs;
      const sourceA_Id = a.sourceId;
      const sourceB_Id = b.sourceId;

      // checking if sources are deffined
      if (!sourceA_Id || !sourceB_Id) return values;
      const valueA = values[sourceA_Id];
      const valueB = values[sourceB_Id];

      if ((!valueA && valueA !== 0) || (!valueB && valueB !== 0)) return values;

      const result = valueA + valueB;
      newValues[node.id] = result;

      return newValues;
    }
    case "substract": {
      const { a, b } = (node as SubstractionNode).data.inputs;
      const sourceA_Id = a.sourceId;
      const sourceB_Id = b.sourceId;

      // checking if sources are deffined
      if (!sourceA_Id || !sourceB_Id) return values;
      const valueA = values[sourceA_Id];
      const valueB = values[sourceB_Id];

      if ((!valueA && valueA !== 0) || (!valueB && valueB !== 0)) return values;

      const result = valueA - valueB;
      newValues[node.id] = result;

      return newValues;
    }
    case "abs": {
      const { sourceId } = (node as AbsoluteNode).data.inputs.a;

      if (!sourceId) return values;

      const valueA = values[sourceId];

      if (isInvalidValue(valueA)) return values;
      const res = Math.abs(valueA!);
      newValues[node.id] = res;
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
        const val = values[id];
        if (!val && val !== 0) {
          allSourcesGiven = false;
          acc[key] = 0;
          return acc;
        }
        acc[key] = val;
        return acc;
      }, {} as NumberFunctionParams);

      if (!allValuesGiven) return values;

      const res = node.data.action(params);
      newValues[node.id] = res;
      return newValues;
    }
    default: {
      console.log("No calculation for " + node.type);
      return values;
    }
  }
};

function isInvalidValue(value: number | null) {
  return !value && value !== 0;
}

export default calculateNode;
