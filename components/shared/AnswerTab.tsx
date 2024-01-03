import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "../card/AnswerCard";
import { ISearchParamsProps } from "@/types";

interface IAnswerTabProps extends ISearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: IAnswerTabProps) => {
  const result = await getUserAnswers({
    userId,
  });

  const {
    totalAnswers,
    answers,
    isNextAnswers
  } = result;

  return (
    <div className="mt-5 flex w-full flex-col gap-6">
      {answers.map((item) => (
        <AnswerCard
          key={item._id}
          _id={item._id}
          author={item.author}
          upvotes={item.upvotes}
          question={item.question}
          createdAt={item.createdAt}
          clerkId={clerkId}
        />
      ))}
    </div>
  );
};

export default AnswerTab;
