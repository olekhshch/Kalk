// sum of squares of numbers in array

import { Vector } from "../../types/nodes";

const sumOfSquares = (vec: Vector) => {
  return vec.reduce((acc, num) => {
    acc += num * num;
    return acc;
  }, 0);
};

export default sumOfSquares;
