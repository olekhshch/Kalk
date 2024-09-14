import { invoke } from "@tauri-apps/api/core";
import {
  AdditionNode,
  AppNode,
  ExpressionNode,
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
    default: {
      console.log("No calculation for " + node.type);
      return values;
    }
  }
};

export default calculateNode;
