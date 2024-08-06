import QuestionCard from "@/components/card/QuestionCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { ICON_POSITION } from "@/constants";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { ISearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevFlow - My Collection | Saved Questions",
  description: "Access your saved questions and curated knowledge on DevFlow. Build a valuable collection, revisit insights, and stay organized in your coding journey.",
  icons: { icon: "/assets/images/site-logo.svg" },
};

const CollectionPage = async ({ searchParams }: ISearchParamsProps) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const page = searchParams?.page || "1";

  const result = await getSavedQuestions({ 
    clerkId: userId,
    searchQuery: searchParams?.q,
    filter: searchParams?.filter,
    page: +page,
    pageSize: 20
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/collection"
          iconPosition={ICON_POSITION.LEFT}
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filters
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((item: any) => (
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
            title="You have not saved any questions"
            description="Explore questions and click the star button on any question's details page if it catches your attention. Your saved questions will appear here for easy access."
            link="/"
            linkTitle="Explore Questions"
          />
        )}
      </div>
      <Pagination pageNumber={+page} isNext={result.isNextQuestions} />
    </>
  );
};

export default CollectionPage;
