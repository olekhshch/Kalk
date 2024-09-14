export const values = new Map<string, number>();

export const getValue = (id: string) => values.get(id);

export const updateValue = (id: string, value: number | null) => {
  if (!value && value !== 0) {
    values.delete(id);
  } else {
    values.set(id, value!);
  }

  const event = new CustomEvent(`result-changed`);
  console.log({ event });
  dispatchEvent(event);
};
