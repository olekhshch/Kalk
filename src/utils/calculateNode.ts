import { invoke } from "@tauri-apps/api/core";
import {
  AppNode,
  ExpressionNode,
  IdentityMtxNode,
  Matrix,
  MtxVecFunctionParams,
  NumberFunctionParams,
  Vector,
} from "../types/nodes";
import { AngleFormat, CalculatedValues, RustCalculations } from "../types/app";
import makeIdentityMatrix from "./matrix/makeIdentityMatrix";
import makeVector from "./matrix/makeVector";
import validate from "./validate";
import makeMtxFromRows from "./matrix/makeMtxFromRows";

type f = (
  node: AppNode,
  values: CalculatedValues,
  angleFormat: AngleFormat
) => Promise<CalculatedValues>;

// #TODO: return null if no calculations were made?
const calculateNode: f = async (node, values, angleFormat) => {
  const newValues = { ...values };
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
          allValuesGiven = false;
          acc[key] = 0;
          return acc;
        }
        acc[key] = val as number;
        return acc;
      }, {} as NumberFunctionParams);

      if (!allValuesGiven) return values;
      const { action } = node.data;

      // passing angleFormat for trigonometric functions
      const res = await action(params, angleFormat);
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
      return newValues;
    }
    case "vec": {
      const inputEntries = Object.entries(node.data.inputs);

      let allSourcesGiven = true;

      const sourceIds = inputEntries.map(([key, { sourceId }]) => {
        if (!sourceId) {
          allSourcesGiven = false;
        }
        return [key, sourceId as string];
      });

      if (!allSourcesGiven) {
        newValues[node.id] = null;
        return newValues;
      }

      let allValuesValid = true;

      const params = sourceIds.reduce((acc, [, sourceId]) => {
        const val = values[sourceId];

        if ((!val && val !== 0) || !isNumber(val)) {
          allValuesValid = false;
          acc.push(0);
          return acc;
        }
        acc.push(val as number);
        return acc;
      }, [] as number[]);

      if (!allValuesValid) return values;

      const res: Vector = makeVector(params);

      newValues[node.id] = res;
      return newValues;
    }
    case "mtx-fn": {
      const inputEntries = Object.entries(node.data.inputs);

      let allSourcesGiven = true;

      const sourceIds = inputEntries.map(([key, { sourceId }]) => {
        if (!sourceId) {
          allSourcesGiven = false;
        }
        return [key, sourceId as string];
      });

      if (!allSourcesGiven) {
        newValues[node.id] = null;
        return newValues;
      }

      let allValuesGiven = true;

      const params = sourceIds.reduce((acc, [key, id]) => {
        let val = values[id];
        // #TODO: Fix type recognition
        const { valid, value } = validate(val, "defined");

        if (!valid) {
          allValuesGiven = false;
          acc[key] = 0;
          return acc;
        }

        acc[key] = value!;
        return acc;
      }, {} as MtxVecFunctionParams);

      if (!allValuesGiven) {
        newValues[node.id] = null;
        return newValues;
      }

      const res = await node.data.action(params);

      newValues[node.id] = res;
      return newValues;
    }
    case "mtx-rows": {
      const inputEntries = Object.entries(node.data.inputs);

      let allSourcesGiven = true;

      const sourceIds = inputEntries.map(([key, { sourceId }]) => {
        if (!sourceId) {
          allSourcesGiven = false;
        }
        return [key, sourceId as string];
      });

      if (!allSourcesGiven) {
        newValues[node.id] = null;
        return newValues;
      }

      let params: Vector[] = [];

      sourceIds.forEach(([, sourceId]) => {
        const val = values[sourceId];
        // val should be a Vector
        if (!Array.isArray(val) || Array.isArray(val[0])) {
          newValues[node.id] = null;
          return newValues;
        }
        params.push(val as Vector);
      });

      const matrix = makeMtxFromRows(params);
      newValues[node.id] = matrix;
      return newValues;
    }
    default: {
      console.log("No calculation for " + node.type);
      return values;
    }
  }
};

const isNumber = (value: number | Matrix | Vector) => !Array.isArray(value);

export default calculateNode;
