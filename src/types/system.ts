import React from "react";

export type Tab = "All" | "Math" | "Matrices" | "Organize" | "File";

export type Action = {
  title: string;
  icon: string;
  command?: string;
};

export type Mode = "edit" | "panning";
