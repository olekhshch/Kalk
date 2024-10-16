import { useReactFlow } from "@xyflow/react";
import Menu from "../../components/Menu";
import MenuButton from "../../components/MenuButton";
import useUI from "../../hooks/useUI";
import { useShallow } from "zustand/react/shallow";

const ScaleMenu = () => {
  const { zoomTo, fitView } = useReactFlow();
  const close = useUI(useShallow((store) => store.closeScale));

  return (
    <Menu
      title="Scale"
      position={{ left: "8px", bottom: "24px" }}
      cssClasses="text-white"
    >
      <ul className="w-[100px] flex flex-col" onClick={() => close()}>
        <li>
          <MenuButton
            title="50% (min)"
            onClick={() => zoomTo(0.5)}
            cssClasses="hover-sec"
          >
            <span>50% (min)</span>
          </MenuButton>
          <MenuButton
            title="100%"
            onClick={() => zoomTo(1)}
            cssClasses="hover-sec"
          >
            <span>100%</span>
          </MenuButton>
          <MenuButton
            title="150%"
            onClick={() => zoomTo(1.5)}
            cssClasses="hover-sec"
          >
            <span>150%</span>
          </MenuButton>
          <MenuButton
            title="200% (max)"
            onClick={() => zoomTo(2)}
            cssClasses="hover-sec"
          >
            <span>200%</span>
          </MenuButton>
          <MenuButton
            title="Fit content"
            onClick={() => fitView()}
            cssClasses="hover-sec"
          >
            <span>Fit content</span>
          </MenuButton>
        </li>
      </ul>
    </Menu>
  );
};

export default ScaleMenu;
