// constructs new Matrix from passed row Vectors

import { InputValue, Matrix, Vector } from "../../types/nodes";
import getValueType from "../getValueType";

type f = (
  vecs: { [k: string]: InputValue },
  defValue?: number
) => Matrix | null;

const makeMtxFromRows: f = (vectors, defValue) => {
  // checking if the same size

  let size = 0;
  let areSameSize = true;
  let allVectors = true;
  const mtx: Matrix = [];

  const vecValues = Object.values(vectors);

  vecValues.forEach((vec) => {
    const valType = getValueType(vec);
    if (valType !== "vector") {
      allVectors = false;
      return null;
    }
    const vecSize = (vec as Vector).length;
    if (vecSize > size) {
      size = vecSize;
    }
    if (vecSize !== size) {
      areSameSize = false;
    }
    mtx.push(vec as Vector);
  });

  if (areSameSize) return mtx;

  // #TODO: Make warning for user
  console.log("Vectors have a different size");

  return mtx.map((vec) => {
    if (vec.length < size) {
      const adjustedVec = [...vec];
      const remainingNum = size - vec.length;
      for (let i = 0; i < remainingNum; i++) {
        adjustedVec.push(defValue ?? 0);
      }
      return adjustedVec;
    }
  });
};

export default makeMtxFromRows;
