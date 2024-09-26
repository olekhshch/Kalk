import React from "react";
import { TableItem as Item } from "../../types/app";
import LateXformula from "../LateXformula";
import { TableCellStyle } from "./SortingTable";

type props = {
  item: Item;
  valueStyles?: (TableCellStyle | null)[];
};
const TableItem = ({ item, valueStyles }: props) => {
  return (
    <tr className="table-row">
      {item.map((cel, idx) => {
        if (!valueStyles || !valueStyles[idx]) {
          return (
            <td key={cel ?? "" + idx} className="px-1  text-sm">
              {cel}
            </td>
          );
        }

        const valStyle = valueStyles[idx];

        return (
          <td key={cel ?? "" + idx} className="px-1  text-sm">
            {valStyle.latex ? <LateXformula value={cel} /> : cel}
          </td>
        );
      })}
    </tr>
  );
};

export default TableItem;
