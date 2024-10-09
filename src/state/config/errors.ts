// collection of error messages specific to nodes calculations

const appErrors: { [k: string]: string } = {
  // Numbers, math nodes
  "100": "Invalid expression",
  "101":
    "At least one of the passed values is invalid or can't be used for this operation",
  "102": "Exponent b should be a number",
  "103": "b can't be equal zero",
  // Vectors / Matrices
  "200":
    "At least one of the entries is invalid / can't be used for this operation",
  "201": "Input a should be a number",
  "202": "All inputs should have the same number of entries",
  "203": "Both inputs should have the same type",
  // Matrix only
  "300": "Size n can't be less than 1",
  "301": "Value of n was rounded to the closest lower integer",
};

export default appErrors;
