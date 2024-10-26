import {
  FunctionOnPlot,
  InputValue,
  PlotEquation,
  PlotNode,
} from "../../types/nodes";
import generateHandleId from "../generateHandleId";
import getValueType from "../getValueType";

type g = (
  node: PlotNode,
  input: InputValue,
  inputId: string
) => { node: PlotNode; inputId: string; eq: PlotEquation } | null;

const addEquation: g = (plotNode: PlotNode, input: InputValue, inputId) => {
  const inputValueType = getValueType(input);
  const eqNum = plotNode.data.equations.length;
  const id = eqNum + 1;

  switch (inputValueType) {
    case "number": {
      const constantEq: FunctionOnPlot = {
        fn: () => input as number,
        of: "x",
        type: "function",
        color: "green",
        id,
      };

      const numOfEquations = plotNode.data.equations.length + 1;

      const newPlotNode: PlotNode = {
        ...plotNode,
        data: { ...plotNode.data, equations: [{ ...constantEq }] },
      };

      newPlotNode.data.inputs["fn" + numOfEquations] = {
        allowedTypes: ["number", "vector", "matrix"],
        valueId: inputId,
      };
      newPlotNode.data.inputs["x" + numOfEquations] = {
        allowedTypes: ["interval"],
        valueId: null,
      };

      newPlotNode.data.equations.push({ ...constantEq });

      return {
        node: newPlotNode,
        inputId: generateHandleId(plotNode.id, "fn" + numOfEquations, [
          "number",
          "vector",
          "matrix",
        ]),
        eq: constantEq,
      };
    }
    default: {
      return null;
    }
  }
};

export default addEquation;
