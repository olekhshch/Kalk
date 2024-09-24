// context/dialog menu button

type props = {
  title: string;
  onClick: () => void;
  cssClasses?: string;
  children: React.ReactNode;
};
const MenuButton = ({ title, onClick, cssClasses, children }: props) => {
  return (
    <button onClick={onClick} className={`px-1 w-full text-left ${cssClasses}`}>
      {children}
    </button>
  );
};

export default MenuButton;
