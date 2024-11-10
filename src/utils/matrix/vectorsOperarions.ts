import { OutputValue, Vector } from "../../types/nodes";

type f = (v: Vector, w: Vector) => OutputValue | Promise<OutputValue>;

const addTwoVectors: f = async (v, w) => {
  if (!v || !w) return null;

  // Numbers
  if (!Array.isArray(v) || !Array.isArray(w)) return null;

  // Matrices
  if (Array.isArray(v[0]) || Array.isArray(w[0])) return null;

  // Vectors

  if (v.length !== w.length) return null;

  const res: Vector = await Promise.all(
    v.map((num, idx) => {
      return (num as number) + (w[idx] as number);
    })
  );

  return res;
};

export default { addTwoVectors };
