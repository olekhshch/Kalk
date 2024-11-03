import { VectorOnPlot } from "../../types/nodes";
import { Vector } from "mafs";

type props = {
  vec: VectorOnPlot;
};
const VectorEquation = ({ vec }: props) => {
  return <Vector tip={vec.tip} color={vec.color} />;
};

export default VectorEquation;
