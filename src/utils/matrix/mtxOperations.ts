import { MtxVecFnAction, Vector } from "../../types/nodes";

import { Matrix } from "../../types/nodes";
import Matrices from "./MatrixProp";
import vectorsOperarions from "./vectorsOperarions";

type f = (mtx1: Matrix, mtx2: Matrix) => Promise<Matrix | null>;

const addTwoMatrices: f = async (mtx1, mtx2) => {
  // checks if the same size
  if (!Matrices.areSameSize(mtx1, mtx2)) return null;

  const sumMtx: Matrix = await Promise.all(
    mtx1.map(
      async (vec, idx) =>
        vectorsOperarions.addTwoVectors(vec, mtx2[idx]) as Vector
    )
  );

  return sumMtx;
};

export default { addTwoMatrices };
