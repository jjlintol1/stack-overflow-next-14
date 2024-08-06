"use client";

import { EDIT_DELETE_TYPES } from "@/constants";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface IEditDeleteActionProps {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: IEditDeleteActionProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleDelete = async () => {
    if (type === EDIT_DELETE_TYPES.QUESTION) {
      await deleteQuestion({
        questionId: JSON.parse(itemId),
        path: pathname,
      });
    } else if (type === EDIT_DELETE_TYPES.ANSWER) {
      await deleteAnswer({
        answerId: JSON.parse(itemId),
        path: pathname,
      });
    }
  };
  return (
    <div className="flex items-center justify-end gap-3">
      {type === EDIT_DELETE_TYPES.QUESTION && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer"
          onClick={() => router.push(`/question/edit/${JSON.parse(itemId)}`)}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        width={14}
        height={14}
        className="cursor-pointer"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
