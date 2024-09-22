// basic operations on numbers

import { InputValue } from "../../types/nodes";
import validate from "../validate";

type f = (a: InputValue, b: InputValue) => number | null;

const addTwoNumbers: f = (a, b) => {
  const valValue1 = validate(a, "number");
  const valValue2 = validate(b, "number");

  if (!valValue1.valid || !valValue2.valid) return null;

  return (a as number) + (b as number);
};

const divideTwoNumbers: f = (a, b) => {
  if (!numberValidator(a) || !numberValidator(b)) return null;

  return (a as number) / (b as number);
};

const multiplyTwoNumbers: f = (a, b) => {
  if (!numberValidator(a) || !numberValidator(b)) return null;

  return (a as number) * (b as number);
};

const subtractTwoNumbers: f = (a, b) => {
  if (!numberValidator(a) || !numberValidator(b)) return null;

  return (a as number) - (b as number);
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
