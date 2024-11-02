// general table with filtering, sorting etc

import { FilterOptions, TableItem as Item } from "../../types/app";
import TableItem from "./TableItem";
import classNames from "classnames";
import "katex/dist/katex.min.css";

export type TableCellStyle = { latex?: boolean };

type props = {
  columns: string[];
  filters: {
    [k: string]: FilterOptions;
  };
  items: Item[];
  minWidths: {
    [k: string]: number;
  };
  cursor: "unset" | "pointer";
  columnStyles?: (TableCellStyle | null)[];
};

const SortingTable = ({
  // filters,
  items,
  columns,
  minWidths,
  cursor,
  columnStyles,
}: props) => {
  return (
    <table className="text-center font-sys w-full">
      <thead className="font-bold bg-sec border-gray border-solid border-[1px]">
        {columns.map((col) => {
          const minWidth = minWidths[col];
          const twClass = classNames(minWidth && `min-w-[160px]`, "px-1");
          return (
            <td key={col} className={twClass}>
              {col}
            </td>
          );
        })}
      </thead>
      <tbody style={{ cursor }}>
        {items.map((item, idx) => (
          <TableItem
            key={idx}
            item={item}
            valueStyles={columnStyles ?? undefined}
            onClick={item.onClick}
          />
        ))}
      </tbody>
    </table>
  );
};

export default SortingTable;
