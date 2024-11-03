import {
  FunctionOnPlot,
  InputValue,
  PlotEquation,
  VectorOnPlot,
} from "../../types/nodes";
import getValueType from "../getValueType";
import getFirstNEntries from "../vectors/getNFirstEntries";

// util that return equation for the Plot (mafs) for a passed value
type f = (input: InputValue) => PlotEquation | null;

const createEquation: f = (input) => {
  const valueType = getValueType(input);

  switch (valueType) {
    case "number": {
      const newEq: FunctionOnPlot = {
        id: 1,
        type: "function",
        of: "x",
        color: "green",
        fn: () => input as number,
      };

      return newEq;
    }
    case "vector": {
      const vec2D = getFirstNEntries(input, 2) as [number, number];
      if (!vec2D) return null;

      const newVec: VectorOnPlot = {
        id: 1,
        type: "vec",
        of: "x",
        color: "blue",
        tip: vec2D,
      };

      return newVec;
    }
    default: {
      return null;
    }
  }
};

export default createEquation;
