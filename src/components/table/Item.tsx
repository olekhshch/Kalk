import { useCallback } from "react";
import { TableItem } from "../../types/app";
import LateXformula from "../LateXformula";

// single item of menu table component
type props = {
  item: TableItem;
};

const Item = ({ item }: props) => {
  return (
    <tr className="hover:bg-gray">
      {item.content.map((cell, idx) => {
        return <TableCell key={idx} value={cell.value} latex={cell.latex} />;
      })}
    </tr>
  );
};

type pr = {
  value: (string | number | undefined) | (string | number | undefined)[];
  latex?: boolean;
};
const TableCell = ({ value }: pr) => {
  const ValueComponent = useCallback(
    (value: string | number | undefined, latex?: boolean) => {
      return latex ? (
        <LateXformula value={value ?? null} />
      ) : (
        <span>{value}</span>
      );
    },
    []
  );

  return (
    <td className="text-center">
      {Array.isArray(value) ? (
        <ol>{value.map((val) => ValueComponent(val))}</ol>
      ) : (
        ValueComponent(value)
      )}
    </td>
  );
};

export default Item;
