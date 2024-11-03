import {
  ActionResult,
  AppNode,
  ConstructorNode,
  DeconstructActionResult,
  DeConstructorNode,
  InputValue,
  NodeOutputs,
  NodePurpose,
  PlotNode,
} from "../../types/nodes";
import {
  AngleFormat,
  CalculatedValues,
  Calculations,
  StoreErrors,
} from "../../types/app";
import makeValueId from "../makeValueId";
import preparePlotData from "./preparePlotData";

type f = (
  node: AppNode,
  values: CalculatedValues,
  angleFormat: AngleFormat
) => Promise<Calculations>;

const calculateNode: f = async (node, values, angleFormat) => {
  const newValues: CalculatedValues = { ...values };
  const nodesToReplace: AppNode[] = [];
  const errors: StoreErrors = {};

  const calculations: Calculations = {
    values: newValues,
    nodesToReplace,
    errors,
  };

  if (node.data.tag === "plot") {
    console.log("CALC PLOT");
    console.log({ node });
    const plotCalcs = preparePlotData(node as PlotNode, newValues);
    return plotCalcs;
  }

  const { action, inputs, outputs, value, purpose } = node.data;

  // no action = node doesn't calculate any value(s)
  if (!action || purpose === NodePurpose.DECOR) return calculations;

  // const inputEntries = Object.entries(inputs);
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
    for (const ipt of inputs) {
      const { valueId, label } = ipt;

      if (!valueId) return resetResult();

      const paramValue = values[valueId];
      params[label] = paramValue;
    }
    // for (const [inputLabel, input] of inputEntries) {
    //   if (!input) {
    //     return resetResult();
    //   }

    //   const { valueId } = input;

    //   if (!valueId) {
    //     return resetResult();
    //   }

    //   const value = values[valueId];
    //   const valType = getValueType(value);

    //   if (!valType || !input.allowedTypes.includes(valType)) {
    //     return resetResult();
    //   }

    //   params[inputLabel] = value;
    // }
  }

  // ============== CONSTRUCTOR =============

  if (purpose === NodePurpose.CONSTRUCT) {
    const { numOfInputVars } = (node as ConstructorNode).data;
    params.n = numOfInputVars;

    for (const inp of inputs) {
      const { valueId, label } = inp;

      if (!valueId) {
        // if no value is passed calculations will continue because od the default inputs
        params[label] = null;
      } else {
        const paramVal = values[valueId];
        params[label] = paramVal;
      }
    }
    // for (const [inputLabel, input] of inputEntries) {
    //   if (!input && input !== 0) {
    //     return resetResult();
    //   }

    //   const { valueId } = input;
    //   if (!valueId) {
    //     // if no value is passed calculations will continue because od the default inputs
    //     params[inputLabel] = null;
    //   } else {
    //     // if value is not defined or is not valid calculations will not continue
    //     const value = values[valueId];
    //     if (
    //       (!value && value !== 0) ||
    //       !input.allowedTypes.includes(getValueType(value)!)
    //     ) {
    //       return resetResult();
    //     }

    //     params[inputLabel] = value;
    //   }
    // }
  }

  const res = await action(params, value, angleFormat);
  errors[node.id] = res ? res.errors : [];

  if (purpose === NodePurpose.DECONSTRUCT) {
    const resOutputs = (res as DeconstructActionResult).outputs;
    const outputs: NodeOutputs = {};
    if (!resOutputs) {
      (node as DeConstructorNode).data.outputs = {};
      nodesToReplace.push(node);
      // #TODO Clearing all of the previous output values
      return calculations;
    }
    Object.entries(resOutputs).forEach(([label, { possibleValues, value }]) => {
      outputs[label] = { possibleValues };
      newValues[makeValueId(node.id, label)] = value;
    });
    node.data.outputs = outputs;
    nodesToReplace.push(node);
    return calculations;
  } else {
    const resValue = (res as ActionResult).res;
    valueIds.forEach((valId) => {
      newValues[valId] = resValue;
    });
  }

  return calculations;
};

export default calculateNode;
