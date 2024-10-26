import { FunctionOnPlot, InputValue, PlotEquation } from "../../types/nodes";
import getValueType from "../getValueType";

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
    default: {
      return null;
    }
  }
};

export default createEquation;
