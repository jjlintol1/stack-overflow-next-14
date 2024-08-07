import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "../card/QuestionCard";
import Pagination from "./Pagination";
import { ISearchParamsProps } from "@/types";

interface IQuestionTabProps extends ISearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({
  searchParams,
  userId,
  clerkId,
}: IQuestionTabProps) => {
  const page = searchParams?.page || "1";

  const result = await getUserQuestions({
    userId,
    page: +page,
    pageSize: 20,
  });

  const { questions, isNextQuestions } = result;

  return (
    <>
      <div className="mt-5 flex w-full flex-col gap-6">
        {questions.map((item) => (
          <QuestionCard
            key={item._id}
            _id={item._id}
            clerkId={clerkId}
            title={item.title}
            tags={item.tags}
            author={item.author}
            upvotes={item.upvotes}
            views={item.views}
            answers={item.answers}
            createdAt={item.createdAt}
          />
        ))}
      </div>
      <Pagination pageNumber={+page} isNext={isNextQuestions} />
    </>
  );
};

export default QuestionTab;
