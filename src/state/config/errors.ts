// collection of error messages specific to nodes calculations

const appErrors: { [k: string]: string } = {
  // Numbers, math nodes
  "100": "Invalid expression",
  "101": "At least one of the passed values is invalid",
  "102": "Exponent b should be a number only",
  // Vector only
  "200": "At least one of the entries is invalid",
  // Matrix only
  "300": "Size n can't be less then 1",
};

export default appErrors;
