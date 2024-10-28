// validator if value is number, Vector, Matrix etc

// import { Matrix, ValueType, Vector } from "../types/nodes";

// type f = (
//   value: number | Matrix | Vector | null | undefined,
//   valueType: ValueType | "defined"
// ) => { valid: boolean; value: number | Matrix | Vector | null | undefined };
// // #TODO: Generics
// // #TODO: Validator tests
// const validate: f = (value, valueType) => {
//   switch (valueType) {
//     case "defined": {
//       const valid = !(!value && value !== 0);
//       return { valid, value: valid ? value : null };
//     }
//     case "matrix": {
//       const valid = Array.isArray(value) && Array.isArray(value[0]);
//       return { valid, value: valid ? (value as Matrix) : value };
//     }
//     case "vector": {
//       const valid = Array.isArray(value) && !Array.isArray(value[0]);
//       return { valid, value: valid ? (value as Vector) : value };
//     }
//     case "number": {
//       const valid = !Array.isArray(value);
//       return { valid, value: valid ? (value as number) : value };
//     }
//     default: {
//       console.log("Can't validate " + value + " as " + valueType);
//       return { valid: false, value: value };
//     }
//   }
// };

// export default validate;
