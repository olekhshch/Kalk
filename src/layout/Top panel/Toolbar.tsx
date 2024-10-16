import { useMemo } from "react";
import actions from "../../state/config/actions";
import useAppState from "../../state/useAppState";
import { Action, ActionToolbar, ActionType } from "../../types/app";
import Button from "../../components/Button";
import useContent from "../../state/useContent";
import { useShallow } from "zustand/react/shallow";

import React from "react";
import actionsToolbar, {
  layoutElement,
  ToolbarElement,
} from "../../state/config/actionsToolbar";
import LargeBtn from "../../components/LargeBtn";
import SmallBtn from "../../components/SmallBtn";
import MultiBtn from "./MultiBtn";

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
              return <MultiBtn content={content} />;
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
// const ActionsPanel = () => {
//   const { active_tab, setMode } = useAppState();
//   const doAction = useContent(useShallow((store) => store.doAction));

//   const actionList = useMemo<Action[]>(() => {
//     if (active_tab !== "All") {
//       return Object.values(actions[active_tab]!);
//     }

//     return Object.values(actions).flat();
//   }, [active_tab]);

//   const clickHandler = (action: Action) => {
//     const {
//       command: { type, data },
//     } = action;
//     switch (type) {
//       case "create": {
//         setMode("create", { type: data });
//         break;
//       }
//       case "action": {
//         if (data) {
//           doAction(data as ActionType);
//         }
//       }
//     }
//   };

//   return (
//     <div className="p-1 px-2 bg-sec h-[73px] text-sm text-black flex flex-col flex-wrap content-start">
//       {actionList.map((action) => (
//         <Button
//           key={action.title}
//           title={action.title}
//           icon={action.icon ?? action.iconLatex ?? "circle"}
//           large={action.large}
//           hoverStyle="main"
//           onClick={() => clickHandler(action)}
//           hideTitle={action.hideToolbarTitle}
//           showIcon={action.icon !== null || !!action.iconLatex}
//           iconLatex={action.iconLatex}
//         />
//       ))}
//     </div>
//   );
// };

// export default ActionsPanel;
