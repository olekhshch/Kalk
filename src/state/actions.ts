import { Action, Tab } from "../types/system";

type Actions = {
  [key in keyof Tab as Tab]?: Action[];
};

const actions: Actions = {
  Math: [
    {
      title: "Expression",
      icon: "expression",
      large: true,
      command: {
        type: "create",
        data: "expression",
      },
    },
    {
      title: "Add",
      icon: "add",
      hideToolbarTitle: true,
      command: {
        type: "create",
        data: "add",
      },
    },
    {
      title: "Substract",
      icon: "substract",
      hideToolbarTitle: true,
      command: {
        type: "create",
        data: "substract",
      },
    },
    {
      title: "Multiply",
      icon: "multiply",
      hideToolbarTitle: true,
      command: {
        type: "create",
        data: "multiply",
      },
    },
    {
      title: "Divide",
      icon: "divide",
      hideToolbarTitle: true,
      command: {
        type: "create",
        data: "divide",
      },
    },
    {
      title: "Power",
      icon: "power",
      command: {
        type: "create",
        data: "power",
      },
    },
    {
      title: "Absolute",
      icon: "abs",
      command: {
        type: "create",
        data: "abs",
      },
    },
    {
      title: "sin",
      icon: null,
      command: {
        type: "create",
        data: "sin",
      },
    },
    {
      title: "cos",
      icon: null,
      command: {
        type: "create",
        data: "cos",
      },
    },
    {
      title: "tan",
      icon: null,
      command: {
        type: "create",
        data: "tg",
      },
    },
    {
      title: "ctan",
      icon: null,
      command: {
        type: "create",
        data: "ctg",
      },
    },
    {
      title: "RAD",
      icon: null,
      command: {
        type: "create",
        data: "to-rad",
      },
    },
    {
      title: "DEG",
      icon: null,
      command: {
        type: "create",
        data: "to-deg",
      },
    },
    {
      title: "asin",
      icon: null,
      command: {
        type: "create",
        // data: "to-deg",
      },
    },
  ],
  Matrices: [
    {
      title: "Matrix",
      icon: "",
      large: true,
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
