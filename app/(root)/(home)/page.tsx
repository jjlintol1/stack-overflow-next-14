import QuestionCard from "@/components/card/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { ICON_POSITION } from "@/constants";
import { HOME_PAGE_FILTER_VALUES, HomePageFilters } from "@/constants/filters";
import { getQuestions, getRecommendedQuestions } from "@/lib/actions/question.action";
import { ISearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

import type { Metadata } from "next";
import { getUserById } from "@/lib/actions/user.action";

export const metadata: Metadata = {
  title: "DevFlow - Explore Questions | Developer Community",
  description: "Discover the latest in programming and development on DevFlow. Engage with our developer community, find solutions, and enhance your coding skills.",
  icons: { icon: "/assets/images/site-logo.svg" },
};


export default async function Home({ searchParams }: ISearchParamsProps) {
  const { userId } = auth();

  const page = searchParams?.page || "1";

  const filter = searchParams?.filter;

  let result;

  if (filter === HOME_PAGE_FILTER_VALUES.RECOMMENDED) {
    if (userId) {
      const user = await getUserById({
        userId
      });
      result = await getRecommendedQuestions({
        userId: user._id,
        searchQuery: searchParams?.q,
        page: +page,
        pageSize: 20
      });
    } else {
      result = {
        questions: [],
        isNextQuestions: false
      }
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams?.q,
      filter,
      page: +page,
      pageSize: 20,
    });
  }

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
        {result.questions.length > 0 ? (
          result.questions.map((item) => (
            <QuestionCard
              key={item._id}
              _id={item._id}
              title={item.title}
              tags={item.tags}
              author={item.author}
              upvotes={item.upvotes}
              views={item.views}
              answers={item.answers}
              createdAt={item.createdAt}
              clerkId={userId || null}
            />
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
      <Pagination pageNumber={+page} isNext={result.isNextQuestions} />
    </>
  );
}
