import React from "react";

type props = {
  title: string;
  showIcon: boolean;
  hideTitle?: boolean;
  onClick?: () => void;
  activeStyling: "main" | "sec";
  icon?: string;
  isActive?: boolean;
};

const ButtonMode = ({ icon, isActive, activeStyling, onClick }: props) => {
  const styling = isActive
    ? activeStyling === "main"
      ? "bg-main text-white"
      : "bg-sec text-black"
    : "";

  return (
    <button className={`${styling}`} onClick={onClick}>
      <img src={`src\\assets\\icons\\${icon ?? "number"}.svg`} />
    </button>
  );
};

export default ButtonMode;
