import React from "react";

type props = {
  title: string;
  showIcon: boolean;
  hideTitle?: boolean;
  onClick?: () => void;
  icon?: string;
  hoverStyle: "main" | "sec";
};

const Button = ({
  title,
  showIcon,
  onClick,
  hideTitle,
  hoverStyle,
  icon,
}: props) => {
  // if click action is specified - fires it, if not - fire action from the store by code
  const clickHandler = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`px-1 rounded-strd h-fit w-fit font-sys flex gap-1 items-center text-${
        hoverStyle === "main" ? "black" : "white"
      } hover:text-white
      } hover:bg-${hoverStyle}`}
      onClick={clickHandler}
    >
      {showIcon && (
        <img
          width="16px"
          src={`src\\assets\\icons\\${icon ?? "number"}.svg`}
          className="grow-0"
        />
      )}
      {!hideTitle && <span>{title}</span>}
    </button>
  );
};

export default Button;
