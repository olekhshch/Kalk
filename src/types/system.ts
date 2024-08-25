import React from "react";

export type Tab = "All" | "Math" | "Matrices" | "Organize";

export type Action = {
  title: string;
  icon: string;
};

export type Mode = "edit" | "panning";
