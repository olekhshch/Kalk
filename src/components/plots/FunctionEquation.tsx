// component to render function on a plot

import { Plot } from "mafs";
import { FunctionOnPlot } from "../../types/nodes";

type props = {
  eq: FunctionOnPlot;
};
const FunctionEquation = ({ eq }: props) => {
  const { fn, of, color } = eq;

  switch (of) {
    case "x":
      return <Plot.OfX y={fn} color={color} />;
    default:
      return <Plot.OfY x={fn} color={color} />;
  }
};

export default FunctionEquation;
