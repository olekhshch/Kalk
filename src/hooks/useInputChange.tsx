import React, { useCallback, useState } from "react";

// Hook to controll regular input and textarea changes.

type props = {
  initialValue: string | number;
  ignoreKeys?: RegExp;
};
const useInputChange = ({ initialValue, ignoreKeys }: props) => {
  const [value, setValue] = useState(initialValue.toString());

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let { value } = e.target;
      if (ignoreKeys) {
        //use RegExp to filter simbols
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
