// component which reterns LateX representation of the passed value
import { Matrix, OutputValue, Vector } from "../types/nodes";
import Latex from "react-latex-next";
import getValueType from "../utils/getValueType";

type props = {
  value: OutputValue | string;
};
const LateXformula = ({ value }: props) => {
  let str: string = "";

  if (typeof value !== "string") {
    const type = getValueType(value);

    if (type === "number") {
      str += value!.toString();
    }
    if (type === "vector") {
      str += "(";
      str += (value as Vector).join("\\\\");
      str += ")";
    }

    if (type === "matrix") {
      str += "\\begin{bmatrix}";

      str += (value as Matrix).map((row) => row.join(" && ")).join("\\\\");
      str += "\\end{bmatrix}";
    }
  } else {
    str = value;
  }

  return <Latex>${str}$</Latex>;
};

export default LateXformula;
