import useProjectOverview from "../../hooks/useProjectOverview";
import { useShallow } from "zustand/react/shallow";
import classNames from "classnames";

const Tabs = () => {
  const [tabs] = useProjectOverview(useShallow((store) => [store.tabs]));
  const [activeTab, openTab] = useProjectOverview(
    useShallow((store) => [store.activeTab, store.openTab])
  );

  return (
    <nav className="max-w-[200px] bg-white w-[160px] flex flex-col">
      {tabs.map((tab) => {
        const twClass = classNames(
          activeTab === tab && "bg-gray",
          "p-2 text-right hover:bg-gray"
        );

        return (
          <button key={tab} className={twClass} onClick={() => openTab(tab)}>
            {tab}
          </button>
        );
      })}
    </nav>
  );
};

export default Tabs;
