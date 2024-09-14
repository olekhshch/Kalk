import { invoke } from "@tauri-apps/api/core";
import { AppNode } from "../types/nodes";
import { CalculatedValues, RustCalculations } from "../types/system";
import { updateValue } from "../state/values";

type f = (
  node: AppNode,
  values: { [id: string]: number | null }
) => Promise<CalculatedValues>;

const calculateNode: f = async (node, values) => {
  const newValues = values;
  switch (node.type) {
    case "expression": {
      const { value } = node.data;
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
    default: {
      return values;
    }
  }
};

export default calculateNode;
