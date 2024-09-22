// context/dialog menu button

type props = {
  title: string;
  onClick: () => void;
  cssClasses?: string;
};
const MenuButton = ({ title, onClick, cssClasses }: props) => {
  return (
    <button onClick={onClick} className={`px-1 w-full text-left ${cssClasses}`}>
      {title}
    </button>
  );
};

export default MenuButton;
