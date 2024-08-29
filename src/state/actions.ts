import NumberIcon from "../assets/icons/NumberIcon";
import { Action, Tab } from "../types/system";

type Actions = {
  [key in keyof Tab as Tab]?: Action[];
};

const actions: Actions = {
  Math: [
    {
      title: "Number",
      icon: "number",
    },
    {
      title: "Sum",
      icon: "sum",
    },
    {
      title: "Multiply",
      icon: "multiply",
    },
    {
      title: "Divide",
      icon: "divide",
    },
  ],
  Matrices: [
    {
      title: "Matrix",
      icon: "",
    },
  ],
  Organize: [
    { title: "Single-line text", icon: "text-single", command: "text-single" },
    { title: "Clear All", icon: "clear-all", command: "clear-all" },
  ],
  File: [
    {
      title: "File overview",
      icon: "",
    },
  ],
};

export default actions;
