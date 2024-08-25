import React from "react";

type props = {
  title: string;
  showIcon: boolean;
  hideTitle?: boolean;
  onClick?: () => void;
  icon?: string;
  isActive?: boolean;
  activeStyle: "main" | "sec";
};

const Button = ({
  title,
  showIcon,
  onClick,
  hideTitle,
  activeStyle,
  isActive,
  icon,
}: props) => {
  // if click action is specified - fires it, if not - fire action from the store by code
  const clickHandler = () => {
    if (onClick) {
      onClick();
    }
  };

  const activeStyleTailwind = `bg-${activeStyle} text-${
    activeStyle === "main" ? "white" : "black"
  }`;

  const hoverStyle = `hover:bg-${activeStyle} text-${
    activeStyle === "main" ? "white" : "white"
  }`;

  return (
    <button
      className={`px-1 rounded-strd h-fit w-fit font-sys ${
        isActive ? activeStyleTailwind : ""
      } flex gap-1 ${hoverStyle}`}
      onClick={clickHandler}
    >
      {showIcon && <img src={`src\\assets\\icons\\${icon ?? "number"}.svg`} />}
      {!hideTitle && <span>{title}</span>}
    </button>
  );
};

export default Button;
