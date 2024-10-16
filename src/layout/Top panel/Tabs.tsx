// import tabs from "../../state/tabs";
import { Tab as TabName } from "../../types/app";
import useAppState from "../../state/useAppState";
import actionsToolbar from "../../state/config/actionsToolbar";

const Tabs = () => {
  const tabs = Object.keys(actionsToolbar);

  return (
    <ul className="px-2 flex gap-0">
      <>
        {[...tabs].map((tab) => {
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
      className={`${!isActive && "tab"} px-1 m-0 h-100% rounded-${
        isActive ? "t" : "b"
      }-strd bg-${isActive ? "sec" : "transparent"}
      text-${isActive ? "black" : "white"}
      hover:text-black`}
    >
      <button onClick={activate}>{name}</button>
    </li>
  );
};

export default Tabs;
