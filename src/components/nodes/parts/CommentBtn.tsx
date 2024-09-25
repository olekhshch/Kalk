import useUI from "../../../hooks/useUI";
import { useShallow } from "zustand/react/shallow";

type props = {
  nodeId: string;
};
const CommentBtn = ({ nodeId }: props) => {
  const openCommentFor = useUI(
    useShallow((store) => store.openNodeCommentField)
  );

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCommentFor(nodeId);
  };

  return (
    <button className="absolute left-1 top-[-26px]" onClick={onClick}>
      *
    </button>
  );
};

export default CommentBtn;
