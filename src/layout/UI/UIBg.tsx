type props = {
  onClick?: React.MouseEventHandler;
};
const UIBg = ({ onClick }: props) => {
  return (
    <div
      className="bg-gray w-screen h-screen fixed opacity-50"
      onClick={onClick}
    />
  );
};

export default UIBg;
