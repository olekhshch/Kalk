const values = new Map<string, number>();

export const getValue = (id: string) => values.get(id);

export const updateValue = (id: string, value: number | null) => {
  if (!value && value !== 0) return;

  return values.set(id, value);
};
