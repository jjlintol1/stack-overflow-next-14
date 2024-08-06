import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "../card/AnswerCard";
import { ISearchParamsProps } from "@/types";
import Pagination from "./Pagination";

interface IAnswerTabProps extends ISearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = async ({
  searchParams,
  userId,
  clerkId,
}: IAnswerTabProps) => {
  const page = searchParams?.page || "1";

  const result = await getUserAnswers({
    userId,
    page: +page,
    pageSize: 20,
  });

  const { answers, isNextAnswers } = result;

  return (
    <>
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
      <Pagination pageNumber={+page} isNext={isNextAnswers} />
    </>
  );
};

export default AnswerTab;
