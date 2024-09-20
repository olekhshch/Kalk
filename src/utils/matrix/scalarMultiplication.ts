import { Vector } from "../../types/nodes";

// scalar mult of a number and a Vector/Matrix
type f = (a: number, v: Vector) => Vector;

const scalarMultiplication: f = (a, v) => {
  return v.map((num) => a * num);
};

export default scalarMultiplication;
