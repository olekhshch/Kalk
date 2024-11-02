import { useEffect } from "react";
import "../../index.css";
import Tabs from "./Tabs";
import useProjectOverview from "../../hooks/useProjectOverview";
import { useShallow } from "zustand/react/shallow";
import Nodes from "./Nodes";

const ProjectOverviewWindow = () => {
  const [activeTab, initialFetch] = useProjectOverview(
    useShallow((store) => [store.activeTab, store.loadStateFromLS])
  );

  useEffect(() => {
    // fetching nodes and values persisted in LS
    initialFetch();
  }, []);

  return (
    <div className="flex w-screen h-screen">
      <Tabs />
      <main className="p-2">{activeTab === "Nodes" && <Nodes />}</main>
    </div>
  );
};

export default ProjectOverviewWindow;
