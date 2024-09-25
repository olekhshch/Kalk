// Node's comment text area

import React from "react";
import useInputChange from "../../../hooks/useInputChange";
import useContent from "../../../state/useContent";
import { useShallow } from "zustand/react/shallow";
import useUI from "../../../hooks/useUI";

type props = {
  nodeId: string;
  text?: string;
};
const CommentField = ({ text, nodeId }: props) => {
  const setComment = useContent(useShallow((store) => store.setCommentFor));
  const closeCommentSection = useUI(
    useShallow((store) => store.closeCommentFielFor)
  );
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const [commentText, onTextAreaChange] = useInputChange({
    initialValue: text ?? "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComment(nodeId, commentText.trim());
    closeCommentSection(nodeId);
  };

  const onCancel = () => {
    closeCommentSection(nodeId);
  };

  return (
    <form
      className="absolute bg-gray top-[-124px] nodrag rounded-strd"
      onClick={onClick}
      onSubmit={onSubmit}
    >
      <textarea
        className="text-xs p-1 m-1 w-[120px] h-[80px] bg-gray resize-none overflow-y-auto"
        value={commentText}
        onChange={onTextAreaChange}
        autoFocus
      />
      <div className="flex text-sm gap-2 mx-1 mb-1">
        <button type="submit">Save</button>
        <button type="reset" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CommentField;
