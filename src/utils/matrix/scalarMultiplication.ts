import { InputValue, Matrix, OutputValue, Vector } from "../../types/nodes";
import validate from "../validate";

// scalar mult of a number and a Vector/Matrix
type f = (a: InputValue, v: InputValue) => Promise<OutputValue>;

const scalarMultiplication: f = async (a, v) => {
  // checking if a is Number
  if (!validate(a, "number").valid) return null;

  // checking if v is Vector or Matrix
  if (!validate(v, "vector").valid && !validate(v, "matrix")) return null;

  // Vector
  if (!Array.isArray((v as Matrix | Vector)[0])) {
    const vec = await scalarVec(a as number, v as Vector);
    return vec;
  }

  // Matrix
  const mtx: Matrix = await Promise.all(
    (v as Matrix).map(async (vec) => scalarVec(a as number, vec))
  );
  return mtx;
};

const scalarVec = async (a: number, v: Vector) => {
  const res: Vector = await Promise.all(v.map(async (num) => a * num));
  return res;
};

export default scalarMultiplication;
