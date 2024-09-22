// constructs new Matrix from passed row Vectors

import { Matrix, Vector } from "../../types/nodes";

type f = (vecs: Vector[], defValue?: number) => Matrix;

const makeMtxFromRows: f = (vectors, defValue) => {
  // checking if the same size

  let size = 0;
  let areSameSize = true;

  vectors.forEach((vec) => {
    const vecSize = vec.length;
    if (vecSize > size) {
      size = vecSize;
    }
    if (vecSize !== size) {
      areSameSize = false;
    }
  });

  if (areSameSize) return [...vectors];

  // #TODO: Make warning for user
  console.log("Vectors have a different size");

  const newVecs = vectors.map((vec) => {
    if (vec.length < size) {
      const adjustedVec = [...vec];
      const remainingNum = size - vec.length;
      for (let i = 0; i < remainingNum; i++) {
        adjustedVec.push(defValue ?? 0);
      }
      return adjustedVec;
    }
    return vec;
  });

  return [...newVecs];
};

export default makeMtxFromRows;
