// constructs new Matrix from passed row Vectors

import { ActionResult, InputValue, Matrix, Vector } from "../../types/nodes";
import getValueType from "../getValueType";

type f = (params: { [k: string]: InputValue }) => ActionResult;

const makeMtxFromRows: f = (params) => {
  const errors: string[] = [];

  const { d, n, ...vecs } = params;

  // default value - should be Vector
  let defValue = d as Vector | null;
  const defValType = getValueType(defValue);
  if (!defValType || defValType !== "vector") {
    defValue = null;
  }

  // #TODO: Ensure right order of row vectors in final matrix
  const rowVectors = Object.values(vecs);

  // #TODO: Ensure all vecs are the same size
  const mtx: Matrix = [];

  // all col vectors should be Vectors and defined. If not defined = then uses defaultVector if provided
  for (const vec of rowVectors) {
    const valType = getValueType(vec);
    if (!valType && !(!defValue && defValue !== 0)) {
      mtx.push(defValue);
    } else if (!valType && !defValue) {
      return { res: null, errors };
    } else if (valType !== "vector") {
      errors.push("101");
      return { res: null, errors };
    } else {
      mtx.push(vec as Vector);
    }
  }

  return { res: mtx, errors };

  // checking if the same size

  // let size = 0;
  // let areSameSize = true;
  // let allVectors = true;
  // const mtx: Matrix = [];

  // const vecValues = Object.values(vectors);

  // vecValues.forEach((vec) => {
  //   const valType = getValueType(vec);
  //   if (valType !== "vector") {
  //     allVectors = false;
  //     return null;
  //   }
  //   const vecSize = (vec as Vector).length;
  //   if (vecSize > size) {
  //     size = vecSize;
  //   }
  //   if (vecSize !== size) {
  //     areSameSize = false;
  //   }
  //   mtx.push(vec as Vector);
  // });

  // if (areSameSize) return mtx;

  // // #TODO: Make warning for user
  // console.log("Vectors have a different size");

  // return mtx.map((vec) => {
  //   if (vec.length < size) {
  //     const adjustedVec = [...vec];
  //     const remainingNum = size - vec.length;
  //     for (let i = 0; i < remainingNum; i++) {
  //       adjustedVec.push(defValue ?? 0);
  //     }
  //     return adjustedVec;
  //   }
  // });
};

export default makeMtxFromRows;
