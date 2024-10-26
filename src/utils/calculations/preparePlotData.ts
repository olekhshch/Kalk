import { CalculatedValues, Calculations, StoreErrors } from "../../types/app";
import {
  AppNode,
  FunctionOnPlot,
  PlotEquation,
  PlotNode,
  Vector,
  VectorOnPlot,
} from "../../types/nodes";
import getValueType from "../getValueType";
import addEquation from "../plots/addEquation";
import createEquation from "../plots/createEquation";

type f = (node: PlotNode, values: CalculatedValues) => Calculations;

const preparePlotData: f = (node, values) => {
  const calculations: Calculations = {
    errors: {},
    nodesToReplace: [],
    values: { ...values },
  };

  const targetNode = { ...node };

  const { inputs } = node.data;
  const inputEntries = Object.entries(inputs).filter(([label]) =>
    label.includes("fn")
  );

  const newEquations: PlotEquation[] = [];

  inputEntries.forEach(([_, input]) => {
    if (input && input.valueId) {
      const passedValue = values[input.valueId];
      const newEq = createEquation(passedValue);
      if (newEq) {
        const id = newEquations.length + 1;
        newEquations.push({ ...newEq, id });
      }
    }
  });

  targetNode.data.equations = newEquations;
  calculations.nodesToReplace.push(targetNode);

  return calculations;
  // const newValues: CalculatedValues = { ...values };
  // const nodesToReplace: AppNode[] = [];
  // const errors: StoreErrors = {};

  // console.log("plot calc");

  // const targetNode = { ...node };

  // const { inputs } = targetNode.data;
  // console.log({ inputs, targetNode });

  // const inputEntries = Object.entries(inputs);
  // const equations: PlotEquation[] = [];

  // inputEntries.forEach(([label, input]) => {
  //   if (!input || input.valueId === null) return;

  //   const passedValue = values[input.valueId];

  //   const newEqData = addEquation(targetNode, passedValue);
  //   console.log({ newEqData });

  //   if (newEqData) {
  //     console.log(newEqData.eq);
  //     equations.push(newEqData.eq);
  //   }
  // });

  // targetNode.data.equations = equations;
  // nodesToReplace.push(targetNode);

  // return { values: newValues, nodesToReplace, errors };
};

export default preparePlotData;
