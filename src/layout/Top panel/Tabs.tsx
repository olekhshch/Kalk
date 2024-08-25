import React from "react";
import tabs from "../../state/tabs";
import { Tab as TabName } from "../../types/system";
import useAppState from "../../state/useAppState";

const Tabs = () => {
  return (
    <div className="px-2 flex gap-0">
      <>
        {tabs.map((name) => {
          return <Tab key={name} name={name} />;
        })}
      </>
    </div>
  );
};

type props = {
  name: TabName;
};

const Tab = ({ name }: props) => {
  const { active_tab, setActiveTab } = useAppState();

  const isActive = active_tab === name;

  const activateTab = () => {
    if (!isActive) {
      setActiveTab(name);
    }
  };

  return (
    <button
      className={`px-2 rounded-t-strd text-sm ${
        isActive && "bg-sec text-black"
      } hover:text-black`}
      onClick={activateTab}
    >
      {name}
    </button>
  );
};

export default Tabs;
