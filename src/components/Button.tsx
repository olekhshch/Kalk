import React from "react";

type props = {
  title: string;
  showIcon: boolean;
  hideTitle?: boolean;
  onClick?: () => void;
  styling: "main" | "sec";
  icon?: string;
  isActive?: boolean;
};

const Button = ({
  title,
  showIcon,
  onClick,
  hideTitle,
  styling,
  icon,
  isActive,
}: props) => {
  // if click action is specified - fires it, if not - fire action from the store by code
  const clickHandler = () => {
    if (onClick) {
      onClick();
    }
  };

  const hoverStyle =
    styling === "main"
      ? "hover:bg-main hover:text-white"
      : "hover:bg-sec hover:text-black";

  const activeStyle =
    isActive && styling === "main" ? "bg-main text-white" : "bg-sec text-black";

  return (
    <button
      className={`px-1 rounded-strd h-fit w-fit font-sys ${hoverStyle} ${activeStyle} $ flex gap-1`}
      onClick={clickHandler}
    >
      {showIcon && <img src={`src\\assets\\icons\\${icon ?? "number"}.svg`} />}
      {!hideTitle && <span>{title}</span>}
    </button>
  );
};

export default Button;
