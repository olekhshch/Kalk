import NumberIcon from "../assets/icons/NumberIcon";

type props = {
  title: string;
};

const ButtonAction = ({ title }: props) => {
  return (
    <button className="px-1 rounded-strd h-fit w-fit hover:bg-main hover:text-white flex gap-1">
      <img src="src\assets\icons\Number.svg" />
      {title}
    </button>
  );
};

export default ButtonAction;
