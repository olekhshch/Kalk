import React from "react";
// import tabs from "../../state/tabs";
import { Action, Tab as TabName } from "../../types/app";
import useAppState from "../../state/useAppState";
import tabs from "../../state/tabs";
import actions from "../../state/config/actions";
import Button from "../../components/Button";

const Tabs = () => {
  const tabs = Object.keys(actions);

  return (
    <ul className="px-2 flex gap-0">
      <>
        {["All", ...tabs].map((tab) => {
          return <Tab key={tab as TabName} name={tab as TabName} />;
        })}
      </>
    </ul>
  );
};

type props = {
  name: TabName;
};

const Tab = ({ name }: props) => {
  const { active_tab, setActiveTab } = useAppState();

  const isActive = active_tab === name;

  const activate = () => {
    if (active_tab !== name) setActiveTab(name);
  };

  return (
    <li
      className={`px-1 m-0 h-100% rounded-${isActive ? "t" : "b"}-strd bg-${
        isActive ? "sec" : "main"
      }
      text-${isActive ? "black" : "white"}
      hover:text-black`}
    >
      <button onClick={activate}>{name}</button>
    </li>
  );
};

export default Tabs;
