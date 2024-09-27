// constructs id of a value to refer

const makeValueId = (nodeId: string, outputLabel: string) =>
  nodeId + "." + outputLabel;

export default makeValueId;
