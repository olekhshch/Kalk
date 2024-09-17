// General window wrapper
type props = {
  title: string;
  children: React.ReactNode;
};

const WindowWrapper = ({ title, children }: props) => {
  return (
    <div className="absolute">
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default WindowWrapper;
