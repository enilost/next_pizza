"use client";
import { FunctionComponent } from "react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { useStoreUser } from "@/store/user";

interface CommentOrderRegistrationProps {
  className?: string;
}

const CommentOrderRegistration: FunctionComponent<
  CommentOrderRegistrationProps
> = ({ className }) => {
  // const [comment, setComment] = useState<string>("");
  const MAX_LENGTH = 300;
  const changeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length > MAX_LENGTH) {
      setComment(text.substring(0, MAX_LENGTH));
      return;
    }
    setComment(e.target.value);
  };
  const [comment, setComment] = useStoreWithEqualityFn(
    useStoreUser,
    (state) => [state.comment, state.setComment],
    (prev, next) => prev[0] === next[0]
  );
  return (
    <>
      <Textarea
        name="comment"
        className={cn("scrl_glbl", className)}
        placeholder="Комментарий к заказу, если необходимо"
        style={{ resize: "none" }}
        rows={3}
        value={comment}
        onChange={(e) => changeComment(e)}
      />
      <p
        className={
          "text-sm pl-3" +
          (comment.length >= MAX_LENGTH ? " text-red-400" : " text-gray-400")
        }
      >
        {comment.length} \ {MAX_LENGTH}
        {/* <span> количество знаков превышено</span> */}
      </p>
    </>
  );
};

export default CommentOrderRegistration;
