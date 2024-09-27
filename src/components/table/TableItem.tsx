import { TableItem as Item } from "../../types/app";
import LateXformula from "../LateXformula";
import { TableCellStyle } from "./SortingTable";

type props = {
  item: Item;
  valueStyles?: (TableCellStyle | null)[];
  onClick?: React.MouseEventHandler;
};
const TableItem = ({ item, valueStyles, onClick }: props) => {
  return (
    <tr className="table-row" onClick={onClick}>
      {item.content.map((cel, idx) => {
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
