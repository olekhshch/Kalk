import React, { useCallback, useState } from "react";

// Hook to controll regular input and textarea changes.

type props = {
  initialValue: string | number;
  allowOnly?: RegExp;
};
const useInputChange = ({ initialValue, allowOnly }: props) => {
  const [value, setValue] = useState(initialValue.toString());

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let { value } = e.target;

      if (allowOnly) {
        const filteredValue = value.match(allowOnly);
        setValue((filteredValue ?? []).join(""));
        return;
      }

      setValue(value);
    },
    []
  );

  return [value, onChange] as [
    string,
    (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  ];
};

export default useInputChange;
