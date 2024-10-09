import {
  Background,
  BackgroundVariant,
  Controls,
  NodeTypes,
  ReactFlow,
} from "@xyflow/react";
import { useEffect, useMemo, useState } from "react";
import "@xyflow/react/dist/style.css";
import ModelNode, {
  ModelNode as ModelType,
} from "../../../components/nodes/app/ModelNode";
import useInputChange from "../../../hooks/useInputChange";
import "katex/dist/katex.min.css";
import { expressionInputValues } from "../../../utils/expressionInputValues";
import ButtonMain from "../../../components/dialogs/ButtonMain";
import useConstants from "../../../hooks/useConstants";
import { useShallow } from "zustand/react/shallow";
import { useDebounce } from "use-debounce";
import { invoke } from "@tauri-apps/api/core";
import { Constant, RustCalculations } from "../../../types/app";

const nodeTypes: NodeTypes = {
  model: ModelNode,
};

const ConstantCreator = () => {
  const [loadFromLS, constants, createConstant] = useConstants(
    useShallow((store) => [
      store.loadFromLS,
      store.constants,
      store.createConstant,
    ])
  );
  // loading constants from state on init
  useEffect(() => {
    loadFromLS();
  }, []);

  // already existing names (ids) of constants
  const reservedNames = useMemo(
    () => constants.map(({ name }) => name),
    [constants]
  );

  const [name, onNameChange] = useInputChange({
    initialValue: "",
    allowOnly: /[a-zA-Z0-9]*/,
  });

  const [label, onLabelChange] = useInputChange({
    initialValue: "\\text{node's label}",
  });

  const [valueString, onValueChange] = useInputChange({
    initialValue: "",
    allowOnly: expressionInputValues,
  });

  const [valueNum, setValueNum] = useState<number | null>(null);

  const [debouncedValueStr] = useDebounce(valueString, 400);

  useEffect(() => {
    invoke("evaluate_expression", { expr: debouncedValueStr }).then((res) => {
      const calc = res as RustCalculations;
      console.log({ calc });
      setValueNum(calc.res as number | null);
    });
  }, [debouncedValueStr]);

  // const [type, setType] = useState<ValueType>("number");

  // const onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const { value } = e.target;
  //   setType(value as ValueType);
  // };

  const addConstant = () => {
    if (!valueNum) return;

    const newConstant: Constant = {
      id: "CONST_" + name,
      name,
      value: valueNum,
      valueType: "number",
      viewLabel: label,
    };

    createConstant(newConstant);
  };

  const previewNode: ModelType = {
    id: "000",
    type: "model",
    position: { x: 40, y: 60 },
    data: {
      outputsNum: 1,
      outputValues: ["number"],
      res_output: true,
      value:
        label.trim() !== ""
          ? label
          : name.trim() !== ""
          ? name
          : "node's label",
    },
  };

  const resultNode: ModelType = {
    id: "r000",
    type: "model",
    position: { x: 160, y: 0 },
    data: {
      outputsNum: 0,
      outputValues: [],
      value: valueNum ?? valueString + " ",
    },
  };

  const disabled =
    name.trim().length === 0 || reservedNames.includes(name) || !valueNum;

  const twLabelClass = "font-bold";

  const twInputClass = "border-b-solid border-gray border-b-[1px]";

  // const twSelectClass = classNames(
  //   {
  //     "bg-sec": type === "number",
  //     "bg-vector": type === "vector",
  //     "text-white": type === "vector",
  //   },
  //   "w-full rounded-[8px] px-1 text-black"
  // );
  return (
    <main>
      <div className="p-2 flex">
        <form
          className="p-2 flex flex-col gap-2 items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <label>
            <p className={twLabelClass}>Name</p>
            <input
              className={twInputClass}
              value={name}
              onChange={onNameChange}
            />
          </label>
          <label>
            <p className={twLabelClass}>Node's label</p>
            <input
              className={twInputClass}
              value={label}
              onChange={onLabelChange}
            />
          </label>
          <label>
            <p className={twLabelClass}>Value (number):</p>
            <input
              className={twInputClass}
              value={valueString}
              onChange={onValueChange}
              placeholder="e.g. 2, 10.23, (2+8)^9.2"
            />
          </label>
          <div className="px-4 flex justify-between w-full">
            <ButtonMain disabled={disabled} onClick={addConstant}>
              Add
            </ButtonMain>
            <button>Reset</button>
          </div>
          {/* <label className="w-full">
            <p className={twLabelClass}>Value's type</p>
            <select
              className={twSelectClass}
              value={type}
              onChange={onTypeChange}
            >
              <option value="number" className="bg-white text-black">
                number
              </option>
              <option value="vector" className="bg-white text-black">
                vector
              </option>
            </select>
          </label> */}
        </form>
        <div className="grow">
          <ReactFlow
            nodes={[previewNode, resultNode]}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background variant={BackgroundVariant.Cross} color="green" />
            <Controls />
          </ReactFlow>
        </div>
      </div>
      {/* <form className="p-2 px-4">
        <label>
          <p className={twLabelClass}>Value:</p>
          <ValueInput type={type} />
        </label>
      </form> */}
    </main>
  );
};

// type pr = {
//   type: ValueType;
// };

// const ValueInput = ({ type }: pr) => {
//   if (type === "number") {
//     return (
//       <input
//         className="border-b-solid border-gray border-b-[1px] w-[220px]"
//         placeholder="...e.g. 2, -3.14, (2+3)^(10-8/2)"
//       />
//     );
//   }

//   return null;
// };

export default ConstantCreator;
