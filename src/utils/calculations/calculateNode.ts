import { invoke } from "@tauri-apps/api/core";
import {
  AppNode,
  AppNodeBase,
  ConstructorNode,
  DeconstructActionResult,
  DeConstructorNode,
  ExpressionNode,
  IdentityMtxNode,
  InputValue,
  Matrix,
  MtxVecFunctionParams,
  NodeOutputs,
  NodePurpose,
  NumberFunctionParams,
  OutputValue,
  Vector,
} from "../../types/nodes";
import {
  AngleFormat,
  CalculatedValues,
  RustCalculations,
} from "../../types/app";
import makeIdentityMatrix from "../matrix/makeIdentityMatrix";
import makeVector from "../matrix/makeVector";
import validate from "../validate";
import makeMtxFromRows from "../matrix/makeMtxFromRows";
import makeValueId from "../makeValueId";
import getValueType from "../getValueType";

type Calculations = { values: CalculatedValues; nodesToReplace: AppNode[] };
type f = (
  node: AppNode,
  values: CalculatedValues,
  angleFormat: AngleFormat
) => Promise<Calculations>;

const calculateNode: f = async (node, values, angleFormat) => {
  const newValues: CalculatedValues = { ...values };
  const nodesToReplace: AppNode[] = [];

  const calculations: Calculations = {
    values: newValues,
    nodesToReplace,
  };

  const { action, inputs, outputs, value, purpose } = node.data;

  // no action = node doesn't calculate any value(s)
  if (!action || purpose === NodePurpose.DECOR) return calculations;

  const inputEntries = Object.entries(inputs);
  const outputKeys = Object.keys(outputs);
  const valueIds = outputKeys.map((key) => makeValueId(node.id, key));

  const resetResult = () => {
    valueIds.forEach((vId) => {
      newValues[vId] = null;
    });
    return calculations;
  };

  const params: { [k: string]: InputValue } = {};

  // ========== FN Node =================
  if (purpose === NodePurpose.FN || purpose === NodePurpose.DECONSTRUCT) {
    for (const [inputLabel, input] of inputEntries) {
      if (!input) {
        return resetResult();
      }

      const { valueId } = input;

      if (!valueId) {
        return resetResult();
      }

      const value = values[valueId];
      const valType = getValueType(value);

      if (!valType || !input.allowedTypes.includes(valType)) {
        return resetResult();
      }

      params[inputLabel] = value;
    }
  }

  // ============== CONSTRUCTOR =============

  if (purpose === NodePurpose.CONSTRUCT) {
    const { numOfInputVars } = (node as ConstructorNode).data;
    params.n = numOfInputVars;
    for (const [inputLabel, input] of inputEntries) {
      if (!input && input !== 0) {
        return resetResult();
      }

      const { valueId } = input;
      if (!valueId) {
        // if no value is passed calculations will continue because od the default inputs
        params[inputLabel] = null;
      } else {
        // if value is not defined or is not valid calculations will not continue
        const value = values[valueId];
        if (
          (!value && value !== 0) ||
          !input.allowedTypes.includes(getValueType(value)!)
        ) {
          return resetResult();
        }

        params[inputLabel] = value;
      }

      // passing default arguments to params
      // const defInputEntries = Object.entries(defaultInputs);

      // for (const [inputLabel, input] of defInputEntries) {
      //   if (!input) return resetResult();

      //   const { valueId, defValue } = input;

      //   if (!valueId && !defValue) {
      //     params[inputLabel] = null;
      //   } else {
      //     params[inputLabel] = valueId ? values[valueId] : defValue;
      //   }
      // }
    }
  }
  console.log({ params });

  const res = await action(params, value, angleFormat);

  if (purpose === NodePurpose.DECONSTRUCT) {
    const resOutputs = res;
    console.log({ resOutputs });
    const outputs: NodeOutputs = {};
    if (!resOutputs) {
      (node as DeConstructorNode).data.outputs = {};
      nodesToReplace.push(node);
      // #TODO Clearing all of the previous output values
      return calculations;
    }
    Object.entries(resOutputs as DeconstructActionResult).forEach(
      ([label, { possibleValues, value }]) => {
        outputs[label] = { possibleValues };
        newValues[makeValueId(node.id, label)] = value;
      }
    );
    node.data.outputs = outputs;
    console.log({ node });
    nodesToReplace.push(node);
    return calculations;
  } else {
    const resValue = res as OutputValue;
    valueIds.forEach((valId) => {
      newValues[valId] = resValue;
    });
  }

  return calculations;

  // switch (node.type) {
  //   case "expression": {
  //     const { value } = (node as ExpressionNode).data;
  //     const resCalc = (await invoke("evaluate_expression", {
  //       expr: value,
  //     }).catch((err) => {
  //       console.log(err);
  //       return {
  //         success: false,
  //         res: "",
  //         msg: "Invoke error",
  //       } as RustCalculations;
  //     })) as RustCalculations;

  //     const valueId = makeValueId(node.id, "N");
  //     if (!resCalc.success) {
  //       newValues[valueId] = null;
  //     } else {
  //       // #TODO: Avoid parsing (Rust side)
  //       newValues[valueId] = parseFloat(resCalc.res);
  //     }
  //     return calculations;
  //   }
  //   case "num-fun": {
  //     const inputEntries = Object.entries(node.data.inputs);
  //     const nodeOutputs = Object.keys(node.data.outputs);
  //     const valueIds = nodeOutputs.map((label) => makeValueId(node.id, label));

  //     let allSourcesGiven = true;

  //     const sourceIds = inputEntries.map(([key, { sourceId }]) => {
  //       if (!sourceId) {
  //         allSourcesGiven = false;
  //       }
  //       return [key, sourceId as string];
  //     });

  //     if (!allSourcesGiven) {
  //       valueIds.forEach((valId) => {
  //         newValues[valId] = null;
  //       });
  //       return calculations;
  //     }

  //     let allValuesGiven = true;

  //     const params = sourceIds.reduce((acc, [key, id]) => {
  //       let val = values[id];
  //       // if source is a constant
  //       if (id.includes("CONST")) {
  //         val = constVals[id];
  //       }
  //       if (!getValueType(val)) {
  //         allValuesGiven = false;
  //         acc[key] = 0;
  //         return acc;
  //       }
  //       acc[key] = val as number;
  //       return acc;
  //     }, {} as NumberFunctionParams);

  //     if (!allValuesGiven) {
  //       valueIds.forEach((valId) => {
  //         newValues[valId] = null;
  //       });
  //       return calculations;
  //     }

  //     const { action } = node.data;

  //     // passing angleFormat for trigonometric functions
  //     const res = await action(params, angleFormat);
  //     valueIds.forEach((valId) => {
  //       newValues[valId] = res;
  //     });
  //     console.log({ calculations });
  //     return calculations;
  //   }
  //   case "i-mtx": {
  //     const { sourceId } = (node as IdentityMtxNode).data.inputs.n;
  //     if (!sourceId) return calculations;

  //     const value = values[sourceId];

  //     if (!value && value !== 0) return calculations;

  //     if (!isNumber(value)) return calculations;

  //     const mtx = makeIdentityMatrix(value as number);

  //     newValues[node.id] = mtx;
  //     return calculations;
  //   }
  //   case "vec": {
  //     const inputEntries = Object.entries(node.data.inputs);

  //     let allSourcesGiven = true;

  //     const sourceIds = inputEntries.map(([key, { sourceId }]) => {
  //       if (!sourceId) {
  //         allSourcesGiven = false;
  //       }
  //       return [key, sourceId as string];
  //     });

  //     if (!allSourcesGiven) {
  //       newValues[node.id] = null;
  //       return calculations;
  //     }

  //     let allValuesValid = true;

  //     const params = sourceIds.reduce((acc, [, sourceId]) => {
  //       const val = values[sourceId];

  //       if ((!val && val !== 0) || !isNumber(val)) {
  //         allValuesValid = false;
  //         acc.push(0);
  //         return acc;
  //       }
  //       acc.push(val as number);
  //       return acc;
  //     }, [] as number[]);

  //     if (!allValuesValid) return calculations;

  //     const res: Vector = makeVector(params);

  //     newValues[node.id] = res;
  //     return calculations;
  //   }
  //   case "mtx-fn": {
  //     const inputEntries = Object.entries(node.data.inputs);

  //     let allSourcesGiven = true;

  //     const sourceIds = inputEntries.map(([key, { sourceId }]) => {
  //       if (!sourceId) {
  //         allSourcesGiven = false;
  //       }
  //       return [key, sourceId as string];
  //     });

  //     if (!allSourcesGiven) {
  //       newValues[node.id] = null;
  //       return calculations;
  //     }

  //     let allValuesGiven = true;

  //     const params = sourceIds.reduce((acc, [key, id]) => {
  //       let val = values[id];
  //       // #TODO: Fix type recognition
  //       const { valid, value } = validate(val, "defined");

  //       if (!valid) {
  //         allValuesGiven = false;
  //         acc[key] = 0;
  //         return acc;
  //       }

  //       acc[key] = value!;
  //       return acc;
  //     }, {} as MtxVecFunctionParams);

  //     if (!allValuesGiven) {
  //       newValues[node.id] = null;
  //       return calculations;
  //     }

  //     const res = await node.data.action(params);

  //     newValues[node.id] = res;
  //     return calculations;
  //   }
  //   case "mtx-rows": {
  //     const inputEntries = Object.entries(node.data.inputs);

  //     let allSourcesGiven = true;

  //     const sourceIds = inputEntries.map(([key, { sourceId }]) => {
  //       if (!sourceId) {
  //         allSourcesGiven = false;
  //       }
  //       return [key, sourceId as string];
  //     });

  //     if (!allSourcesGiven) {
  //       newValues[node.id] = null;
  //       return calculations;
  //     }

  //     let params: Vector[] = [];

  //     sourceIds.forEach(([, sourceId]) => {
  //       const val = values[sourceId];
  //       // val should be a Vector
  //       if (!Array.isArray(val) || Array.isArray(val[0])) {
  //         newValues[node.id] = null;
  //         return calculations;
  //       }
  //       params.push(val as Vector);
  //     });

  //     const matrix = makeMtxFromRows(params);
  //     newValues[node.id] = matrix;
  //     return calculations;
  //   }
  //   default: {
  //     console.log("No calculation for " + node.type);
  //     return calculations;
  //   }
  // }
};

const isNumber = (value: number | Matrix | Vector) => !Array.isArray(value);

export default calculateNode;
