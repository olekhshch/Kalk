import React from "react";
import Menu from "../../components/Menu";
import { RgbColorPicker } from "react-colorful";

type props = {
  includeTransaparent: boolean;
};
const ColorPicker = ({ includeTransaparent }: props) => {
  return (
    <div className="absolute bg-white shadow-sec p-1 rounded-strd">
      <RgbColorPicker />
    </div>
  );
};

export default ColorPicker;
