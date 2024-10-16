type props = {
  swatches: string[];
  onClick: (color: string) => void;
  withTransparent?: boolean;
};
const ColorPallete = ({ swatches, onClick, withTransparent }: props) => {
  return (
    <div className="flex gap-1">
      {withTransparent && (
        <button
          className="w-[18px] h-[18px]"
          onClick={() => onClick("transparent")}
        >
          X
        </button>
      )}
      {swatches.map((color) => (
        <button
          key={color}
          style={{ background: color }}
          className="w-[18px] h-[18px]"
          onClick={() => onClick(color)}
        />
      ))}
    </div>
  );
};

export default ColorPallete;
