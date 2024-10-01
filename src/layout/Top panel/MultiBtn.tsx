import React from "react";
import { ActionToolbar } from "../../types/app";
import LargeBtn from "../../components/LargeBtn";
import SmallBtn from "../../components/SmallBtn";

type props = {
  content: ActionToolbar[];
};
const MultiBtn = ({ content }: props) => {
  const [mainAction, ...otherActions] = content;
  return (
    <div className="flex hover:bg-main rounded-strd pt-1 relative">
      {mainAction.large ? (
        <LargeBtn action={mainAction} />
      ) : (
        <SmallBtn action={mainAction} />
      )}
      <div className="w-[1px] bg-main" />
      <button className="text-xs hover:text-white px-1 relative">
        <span>▼</span>
      </button>
      <ExpandedMenu />
    </div>
  );
};

const ExpandedMenu = () => {
  return <div className="bg-sec fixed top-[112px]">menu</div>;
};

export default MultiBtn;
