import { Action, Tab } from "../types/system";

type Actions = {
  [key in keyof Tab as Tab]?: Action[];
};

const actions: Actions = {
  Math: [
    {
      title: "Expression",
      icon: "expression",
      command: {
        type: "create",
        data: "expression",
      },
    },
    {
      title: "Add",
      icon: "add",
      command: {
        type: "create",
        data: "add",
      },
    },
    {
      title: "Substract",
      icon: "substract",
      command: {
        type: "create",
        data: "substract",
      },
    },
    {
      title: "Multiply",
      icon: "multiply",
      command: {
        type: "create",
      },
    },
    {
      title: "Divide",
      icon: "divide",
      command: {
        type: "create",
      },
    },
  ],
  Matrices: [
    {
      title: "Matrix",
      icon: "",
      command: {
        type: "create",
      },
    },
  ],
  Organize: [
    {
      title: "Single-line text",
      icon: "text-single",
      command: {
        type: "create",
        data: "text-single",
      },
    },
    {
      title: "Clear All",
      icon: "clear-all",
      command: {
        type: "action",
        data: "clear-all",
      },
    },
    {
      title: "Select All",
      icon: "select",
      command: {
        type: "action",
      },
    },
  ],
  File: [
    {
      title: "File overview",
      icon: "",
      command: {
        type: "action",
      },
    },
  ],
};

export default actions;
