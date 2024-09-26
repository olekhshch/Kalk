import { Action, Tab } from "../../types/app";

// List of all actions availabe in the app

type Actions = {
  [key in keyof Tab as Tab]?: Action[];
};

const actions: Actions = {
  Math: [
    {
      title: "Expression",
      icon: null,
      iconLatex: "\\boldsymbol{(1-2)^3}",
      large: true,
      command: {
        type: "create",
        data: "expression",
      },
    },
    {
      title: "Add",
      icon: null,
      iconLatex: "\\boldsymbol{+}",
      hideToolbarTitle: true,
      command: {
        type: "create",
        data: "add",
      },
    },
    {
      title: "Subtract",
      icon: null,
      iconLatex: "\\boldsymbol{-}",
      hideToolbarTitle: true,
      command: {
        type: "create",
        data: "subtract",
      },
    },
    {
      title: "Multiply",
      icon: null,
      iconLatex: "\\boldsymbol{\\cdot}",
      hideToolbarTitle: true,
      command: {
        type: "create",
        data: "multiply",
      },
    },
    {
      title: "Divide",
      icon: null,
      iconLatex: "{\\div}",
      hideToolbarTitle: true,
      command: {
        type: "create",
        data: "divide",
      },
    },
    {
      title: "Power",
      icon: null,
      iconLatex: "a^b",
      command: {
        type: "create",
        data: "power",
      },
    },
    {
      title: "Abs",
      icon: null,
      iconLatex: "|a|",
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
    {
      title: "arctg",
      icon: null,
      command: {
        type: "create",
        data: "atg",
      },
    },
    {
      title: "floor",
      icon: null,
      command: {
        type: "create",
        data: "floor",
      },
    },
    {
      title: "ceil",
      icon: null,
      command: {
        type: "create",
        data: "ceil",
      },
    },
    {
      title: "Constant",
      icon: null,
      iconLatex: "\\pi",
      large: true,
      command: {
        type: "action",
        data: "constant",
      },
    },
  ],
  Matrices: [
    {
      title: "Matrix (from rows)",
      icon: null,
      iconLatex:
        "\\tiny{\\begin{bmatrix}\\vec{v} \\\\ \\dots \\\\ \\vec{w}\\end{bmatrix} \\implies M}",
      large: true,
      command: {
        type: "create",
        data: "mtx-rows",
      },
    },
    {
      title: "Vector",
      icon: null,
      iconLatex: "\\vec{v}",
      hideToolbarTitle: true,
      command: {
        type: "create",
        data: "vec",
      },
    },
    {
      title: "Identity matrix",
      icon: null,
      iconLatex: "I_n",
      hideToolbarTitle: true,
      command: {
        type: "create",
        data: "I-matrix",
      },
    },
    {
      title: "Add vectors/matrices",
      icon: null,
      iconLatex: "\\scriptsize{A+B}",
      command: {
        type: "create",
        data: "add-mtx",
      },
    },
    {
      title: "Scalar multiplication",
      icon: null,
      iconLatex: "\\alpha\\vec{v}",
      command: {
        type: "create",
        data: "scalar-mult",
      },
    },
    {
      title: "Dot product",
      icon: null,
      iconLatex: "\\small{\\vec{a}\\cdot\\vec{b}}",
      command: {
        type: "create",
        data: "dot-prod",
      },
    },
    {
      title: "Norm",
      icon: null,
      iconLatex: "\\small{\\boldsymbol{\\lVert\\vec{v}\\rVert}}",
      command: {
        type: "create",
        data: "norm",
      },
    },
    {
      title: "Cross product",
      icon: null,
      iconLatex: "\\boldsymbol{\\times}",
      command: {
        type: "create",
        data: "cross-prod",
      },
    },
    {
      title: "Sum all",
      icon: null,
      iconLatex: "\\sum{a_i}",
      command: {
        type: "create",
        data: "sum-all",
      },
    },
    {
      title: "det(M)",
      icon: null,
      command: {
        type: "create",
        data: "det",
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
    {
      title: "Show all results",
      icon: null,
      command: {
        type: "action",
        data: "show-res",
      },
    },
  ],
  Project: [
    {
      title: "Project overview",
      large: true,
      icon: "",
      command: {
        type: "action",
        data: "project-overview",
      },
    },
  ],
};

export default actions;
