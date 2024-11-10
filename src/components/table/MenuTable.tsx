// Table component for menus, dialogs etc

import { TableItem } from "../../types/app";
import HeaderItem from "./HeaderItem";
import Item from "./Item";

type props = {
  headerColumns: string[];
  items: TableItem[];
};

const MenuTable = ({ headerColumns, items }: props) => {
  return (
    <table className="w-full select-none border-b-2 border-sec">
      <thead>
        <tr className="bg-sec">
          {headerColumns.map((col) => (
            <HeaderItem key={col} title={col} />
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <Item key={idx} item={item} />
        ))}
      </tbody>
    </table>
  );
};

export default MenuTable;
