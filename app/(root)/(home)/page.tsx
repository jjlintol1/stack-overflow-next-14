import QuestionCard from "@/components/card/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { ICON_POSITION } from "@/constants";
import { HomePageFilters } from "@/constants/filters";
import { IQuestionProps } from "@/types";
import Link from "next/link";



const questions: IQuestionProps[] = [
  {
    _id: "1",
    title: "Cascading Deletes in SQLAlchemy?",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "sql" },
    ],
    author: { _id: "1", name: "John Doe", picture: "/assets/images/logo.png" },
    upvotes: 101506,
    views: 1000007,
    answers: [],
    createdAt: new Date("2022-12-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "3", name: "html" },
      { _id: "4", name: "css" },
    ],
    author: { _id: "2", name: "Jane Smith", picture: "/assets/images/logo.png" },
    upvotes: 35550,
    views: 150000002,
    answers: [],
    createdAt: new Date("2023-09-02T10:30:00.000Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPosition={ICON_POSITION.LEFT}
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filters
          filters={HomePageFilters}
          otherClasses="min-h-[56px] w-full sm:w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((item) => (
            <QuestionCard key={item._id} question={item} />
          ))
        ) : (
          <NoResult
            title="There are no questions to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. Your query could be the next big thing others learn from.
        Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
