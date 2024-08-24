import NumberIcon from "../assets/icons/NumberIcon";
import { Action, Tab } from "../types/system";

type Actions = {
  [key in keyof Tab as Tab]?: Action[];
};

const actions: Actions = {
  Math: [
    {
      title: "Number",
      icon: "",
    },
    {
      title: "Sum",
      icon: "./",
    },
    {
      title: "Multiply",
      icon: "./",
    },
    {
      title: "Divide",
      icon: "./",
    },
  ],
  Matrices: [
    {
      title: "Matrix",
      icon: "",
    },
  ],
  Organize: [{ title: "Single-line text", icon: "." }],
};

export default actions;
