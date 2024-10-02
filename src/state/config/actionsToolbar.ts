// layout obj for actions of Toolbar

import { ActionToolbar, Tab } from "../../types/app";

type SubCategory =
  | "Arithmetic"
  | "Operations"
  | "Trigonometry"
  | "Rounding"
  | "Construct"
  | "Deconstruct"
  | "Other"
  | "Nodes";

export type layoutElement<T extends "action" | "group" | "multibtn"> = {
  type: T;
  content: ActionToolbar | ActionToolbar[];
};

type actionElement = layoutElement<"action"> & {
  content: ActionToolbar;
};

type groupElement = layoutElement<"group"> & {
  content: ActionToolbar[];
};

type multibtnElement = layoutElement<"multibtn"> & {
  content: ActionToolbar[];
};

export type ToolbarElement = actionElement | groupElement | multibtnElement;

type Toolbar = {
  [key in keyof Tab as Tab]?: {
    [k in keyof SubCategory as SubCategory]?: ToolbarElement[];
  };
};

const actionsToolbar: Toolbar = {
  Math: {
    Arithmetic: [
      {
        type: "action",
        content: {
          title: "Expression",
          icon: "(1+2)^3",
          iconType: "latex",
          large: true,
          command: { type: "create", data: "expression" },
        },
      },
      {
        type: "group",
        content: [
          {
            title: "Add",
            icon: "\\large{+}",
            iconType: "latex",
            hideTitle: true,
            command: { type: "create", data: "add" },
          },
          {
            title: "Subtract",
            icon: "\\large{-}",
            iconType: "latex",
            hideTitle: true,
            command: { type: "create", data: "subtract" },
          },
          {
            title: "Multiply",
            icon: "\\large{\\cdot}",
            iconType: "latex",
            hideTitle: true,
            command: { type: "create", data: "multiply" },
          },
          {
            title: "Divide",
            icon: "\\large{\\div}",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "divide",
            },
          },
        ],
      },
    ],
    Operations: [
      {
        type: "group",
        content: [
          {
            title: "Power",
            icon: "a^b",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "power",
            },
          },
          {
            title: "Absolute",
            icon: "\\lVert a \\rVert",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "abs",
            },
          },
          {
            title: "Nth root",
            icon: "\\sqrt[n]{a}",
            iconType: "latex",
            // hideTitle: true,
            command: {
              type: "create",
              data: "abs",
            },
          },
        ],
      },
    ],
    Trigonometry: [
      {
        type: "group",
        content: [
          {
            title: "Sine",
            icon: "\\small{\\sin(a)}",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "sin",
            },
          },
          {
            title: "Cosine",
            icon: "\\small{\\cos(a)}",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "cos",
            },
          },
          {
            title: "Tangent",
            icon: "\\small{\\tan(a)}",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "tg",
            },
          },
          {
            title: "Cotangent",
            icon: "\\small{\\cot(a)}",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "ctg",
            },
          },
          {
            title: "RAD",
            icon: "",
            iconType: "latex",
            hideIcon: true,
            // hideTitle: true,
            command: {
              type: "create",
              data: "to-rad",
            },
          },
          {
            title: "DEG",
            icon: "",
            iconType: "latex",
            hideIcon: true,
            // hideTitle: true,
            command: {
              type: "create",
              data: "to-deg",
            },
          },
        ],
      },
      // {
      //   type: "group",
      //   content: [
      //     {
      //       title: "RAD",
      //       icon: "",
      //       iconType: "latex",
      //       hideIcon: true,
      //       // hideTitle: true,
      //       command: {
      //         type: "create",
      //         data: "to-rad",
      //       },
      //     },
      //     {
      //       title: "DEG",
      //       icon: "",
      //       iconType: "latex",
      //       hideIcon: true,
      //       // hideTitle: true,
      //       command: {
      //         type: "create",
      //         data: "to-deg",
      //       },
      //     },
      //   ],
      // },
      {
        type: "group",
        content: [
          {
            title: "Asine",
            icon: "\\small{\\arcsin(a)}",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "asin",
            },
          },
          {
            title: "Acosine",
            icon: "\\small{\\arccos(a)}",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "acos",
            },
          },
          {
            title: "Arctagent",
            icon: "\\small{\\arctan(a)}",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "atg",
            },
          },
        ],
      },
    ],
    Rounding: [
      {
        type: "group",
        content: [
          {
            title: "floor",
            icon: "",
            iconType: "latex",
            hideIcon: true,
            // hideTitle: true,
            command: {
              type: "create",
              data: "floor",
            },
          },
          {
            title: "ceil",
            icon: "",
            iconType: "latex",
            hideIcon: true,
            // hideTitle: true,
            command: {
              type: "create",
              data: "ceil",
            },
          },
        ],
      },
    ],
    Other: [
      {
        type: "action",
        content: {
          title: "Constant",
          icon: "\\boldsymbol{\\large{\\pi}}",
          iconType: "latex",
          large: true,
          command: {
            type: "action",
            data: "constant",
          },
        },
      },
    ],
  },
  Matrices: {
    Construct: [
      {
        type: "action",
        content: {
          title: "Matrix (from rows)",
          icon: "\\tiny{\\begin{bmatrix} \\vec{v} \\\\ \\dots \\\\ \\vec{w} \\end{bmatrix}} \\implies M",
          iconType: "latex",
          large: true,
          command: {
            type: "create",
            data: "mtx-rows",
          },
        },
      },
      {
        type: "action",
        content: {
          title: "Matrix (from columns)",
          icon: "\\scriptsize{\\begin{bmatrix} \\vec{v} & \\dots & \\vec{w} \\end{bmatrix}} \\implies M",
          iconType: "latex",
          large: true,
          command: {
            type: "create",
            data: "mtx-cols",
          },
        },
      },
      {
        type: "group",
        content: [
          {
            title: "Vector",
            icon: "\\vec{v}",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "vec",
            },
          },
          {
            title: "Identity matrix",
            icon: "I_n",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "I-matrix",
            },
          },
        ],
      },
    ],
    Operations: [
      {
        type: "group",
        content: [
          {
            title: "Norm",
            icon: "\\lVert \\vec{v} \\rVert",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "norm",
            },
          },
          {
            title: "Scalar multiplication",
            icon: "\\alpha \\vec{v}",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "scalar-mult",
            },
          },
          {
            title: "Add vectors/matrices",
            icon: "A+B",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "add-mtx",
            },
          },
          {
            title: "Sum all",
            icon: "\\sum{a_i}",
            iconType: "latex",
            hideTitle: true,
            command: {
              type: "create",
              data: "sum-all",
            },
          },
        ],
      },
    ],
    Deconstruct: [
      {
        type: "group",
        content: [
          {
            title: "Vector's entries",
            icon: "",
            iconType: "latex",
            hideIcon: true,
            // hideTitle: true,
            command: {
              type: "create",
              data: "entries-vec",
            },
          },
          {
            title: "Matrix's rows",
            icon: "",
            iconType: "latex",
            hideIcon: true,
            // hideTitle: true,
            command: {
              type: "create",
              data: "entries-vec",
            },
          },
        ],
      },
    ],
  },
  Organize: {
    Nodes: [
      {
        type: "group",
        content: [
          {
            title: "Simple text",
            icon: "",
            iconType: "latex",
            hideIcon: true,
            command: { type: "create", data: "text-single" },
          },
          {
            title: "Show all results",
            icon: "",
            iconType: "latex",
            hideIcon: true,
            command: { type: "action", data: "show-res" },
          },
          {
            title: "Hide all results",
            icon: "",
            iconType: "latex",
            hideIcon: true,
            command: { type: "action", data: "hide-res" },
          },
          {
            title: "Clear canvas",
            icon: "",
            iconType: "latex",
            hideIcon: true,
            command: { type: "action", data: "clear-all" },
          },
        ],
      },
    ],
  },
  Project: {},
};

export default actionsToolbar;
