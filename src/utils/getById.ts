type f = (
  array: { id: string }[],
  nodeId: string[] | string
) => { id: string }[];

const getById: f = (array: { id: string }[], nodeId: string[] | string) => {
  if (!Array.isArray(nodeId)) {
    const target = array.find((item) => item.id === nodeId);
    return target ? [target] : [];
  }

  return array.filter(({ id }) => nodeId.includes(id));
};

export default getById;
