import React from "react";
import NumberIcon from "../assets/icons/NumberIcon";

type props = {
  title: string;
  showIcon: boolean;
  onClick?: () => void;
};

const ButtonAction = ({ title, showIcon, onClick }: props) => {
  // if click action is specified - fires it, if not - fire action from the store by code
  const clickHandler = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className="px-1 rounded-strd h-fit w-fit font-sys hover:bg-main hover:text-white flex gap-1"
      onClick={clickHandler}
    >
      {showIcon && <img src="src\assets\icons\Number.svg" />}
      <span>{title}</span>
    </button>
  );
};

export default ButtonAction;
