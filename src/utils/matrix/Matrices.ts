import { Matrix } from "../../types/nodes";

const r = (mtx: Matrix) => mtx.length;

const c = (mtx: Matrix) => mtx[0].length;

const size = (mtx: Matrix) => ({
  r: r(mtx),
  c: c(mtx),
});

const areSameSize = (mtx1: Matrix, mtx2: Matrix) => {
  const size1 = size(mtx1);
  const size2 = size(mtx2);

  return size1.c === size2.c && size1.r === size2.r;
};

export default { r, c, size, areSameSize };
