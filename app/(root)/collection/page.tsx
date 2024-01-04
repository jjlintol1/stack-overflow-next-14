import QuestionCard from "@/components/card/QuestionCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { ICON_POSITION } from "@/constants";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const CollectionPage = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const result = await getSavedQuestions({ clerkId: userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/collections"
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
              clerkId={item.author.clerkId || null}
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
    </>
  );
};

export default CollectionPage;
