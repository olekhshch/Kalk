import { useMemo } from "react";
import useAppState from "../../state/useAppState";
import { useShallow } from "zustand/react/shallow";
import actionsToolbar, {
  ToolbarElement,
} from "../../state/config/actionsToolbar";
import LargeBtn from "../../components/LargeBtn";
import SmallBtn from "../../components/SmallBtn";

const Toolbar = () => {
  const [activeTab] = useAppState(useShallow((store) => [store.active_tab]));
  const actionsList = useMemo(() => {
    return Object.entries(actionsToolbar[activeTab]!);
  }, [activeTab]);

  return (
    <div className=" h-[78px] bg-sec flex text-black px-1">
      {actionsList.map(([subcategory, actions]) => (
        <SubCategory key={subcategory} name={subcategory} content={actions} />
      ))}
      <div className="bg-sec grow" />
    </div>
  );
};

export default Toolbar;

type p = {
  name: string;
  content: ToolbarElement[];
};
const SubCategory = ({ name, content }: p) => {
  return (
    <>
      <div className="bg-sec flex flex-col rounded-strd justify-between px-1 text-sm">
        <div className="flex grow items-center gap-2">
          {content.map(({ type, content }, idx) => {
            if (type === "action") {
              return content.large ? (
                <LargeBtn key={content.title} action={content} />
              ) : (
                <SmallBtn key={content.title} action={content} />
              );
            }

            if (type === "group") {
              return (
                <div key={idx} className="flex flex-col flex-wrap max-h-[64px]">
                  {content.map((action) => {
                    return action.large ? (
                      <LargeBtn key={action.title} action={action} />
                    ) : (
                      <SmallBtn key={action.title} action={action} />
                    );
                  })}
                </div>
              );
            }

            if (type === "multibtn") {
              return null;
            }
          })}
        </div>
        <p className="text-xs px-1 text-center text-main hover:text-black transition">
          {name}
        </p>
      </div>
      <div className="w-[4px] my-1 rounded-strd bg-main bg-opacity-60"></div>
    </>
  );
};
