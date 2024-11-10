type props = {
  title: string;
};
const HeaderItem = ({ title }: props) => {
  return <th>{title}</th>;
};

export default HeaderItem;
