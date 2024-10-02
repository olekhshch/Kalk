// basic operations on numbers

import { ActionResult, InputValue } from "../../types/nodes";
import validate from "../validate";

type f = (a: InputValue, b: InputValue) => ActionResult;

const addTwoNumbers: f = (a, b) => {
  const valValue1 = validate(a, "number");
  const valValue2 = validate(b, "number");

  if (!valValue1.valid || !valValue2.valid) return { errors: [], res: null };

  return { res: (a as number) + (b as number), errors: [] };
};

const divideTwoNumbers: f = (a, b) => {
  if (!numberValidator(a) || !numberValidator(b))
    return { res: null, errors: [] };

  return { res: (a as number) / (b as number), errors: [] };
};

const multiplyTwoNumbers: f = (a, b) => {
  if (!numberValidator(a) || !numberValidator(b))
    return { res: null, errors: [] };

  return { res: (a as number) * (b as number), errors: [] };
};

const subtractTwoNumbers: f = (a, b) => {
  if (!numberValidator(a) || !numberValidator(b))
    return { res: null, errors: [] };

  return { res: (a as number) - (b as number), errors: [] };
};

export default {
  addTwoNumbers,
  divideTwoNumbers,
  multiplyTwoNumbers,
  subtractTwoNumbers,
};

const numberValidator = (a: InputValue) => {
  return validate(a, "number").valid;
};
