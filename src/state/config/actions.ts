import { Action, Tab } from "../../types/system";

// List of all actions availabe in the app

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
      title: "tg",
      icon: null,
      command: {
        type: "create",
        data: "tg",
      },
    },
    {
      title: "ctg",
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
        data: "asin",
      },
    },
    {
      title: "acos",
      icon: null,
      command: {
        type: "create",
        data: "acos",
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
    {
      title: "Identity matrix",
      icon: "i_mtx",
      command: {
        type: "create",
        data: "I-matrix",
      },
    },
    {
      title: "Vector",
      icon: "vec",
      command: {
        type: "create",
        data: "vec",
      },
    },
    {
      title: "Norm",
      icon: "norm",
      command: {
        type: "create",
        data: "norm",
      },
    },
    {
      title: "Add vectors/matrices",
      icon: "add-mtx",
      command: {
        type: "create",
        data: "add-mtx",
      },
    },
    {
      title: "Scalar multiplication",
      icon: "scalar",
      command: {
        type: "create",
        data: "scalar-mult",
      },
    },
    {
      title: "Dot product",
      icon: "dot",
      command: {
        type: "create",
        data: "dot-prod",
      },
    },
    {
      title: "Cross product",
      icon: "cross",
      command: {
        type: "create",
        data: "cross-prod",
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
