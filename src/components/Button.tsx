import React from "react";
import LateXformula from "./LateXformula";

type props = {
  title: string;
  showIcon: boolean;
  hideTitle?: boolean;
  onClick?: React.MouseEventHandler;
  icon: string;
  iconLatex?: string;
  large?: boolean;
  hoverStyle: "main" | "sec";
};

const Button = ({
  title,
  showIcon,
  onClick,
  hideTitle,
  hoverStyle,
  icon,
  iconLatex,
  large,
}: props) => {
  // if click action is specified - fires it, if not - fire action from the store by code
  const clickHandler = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`px-1 rounded-strd h-fit w-fit w-min-[16px] font-sys flex gap-2 items-center justify-center hover:text-white hover-${hoverStyle}`}
      onClick={(e) => clickHandler(e)}
      style={{
        flexDirection: large ? "column" : "row",
        height: large ? "100%" : "fit-content",
        alignItems: large ? "center" : "baseline",
        gap: large ? "0" : "8px",
      }}
    >
      {showIcon &&
        (iconLatex ? (
          <div className="text-[1.1rem] min-w-[16px]">
            <LateXformula value={iconLatex} />
          </div>
        ) : (
          <img
            width={large ? "32px" : "16px"}
            src={`src\\assets\\icons\\${
              icon ? icon : iconLatex ?? "circle"
            }.svg`}
            className="grow-0"
          />
        ))}
      {!hideTitle && <span>{title}</span>}
    </button>
  );
};

export default Button;
