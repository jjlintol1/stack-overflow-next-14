import QuestionCard from "@/components/card/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { ICON_POSITION } from "@/constants";
import { getQuestionsByTagId } from "@/lib/actions/tag.actions";
import { IURLProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";



const TagDetailsPage = async ({
  params,
  searchParams,
}: IURLProps) => {
  const { userId } = auth();

  const tagId = params.id;

  const page = searchParams?.page || "1";

  const result = await getQuestionsByTagId({
    tagId,
    searchQuery: searchParams?.q,
    page: +page,
    pageSize: 20
  });

  const { tagName, questions } = result;
 
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{tagName}</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={`/tags/${tagId}`}
          iconPosition={ICON_POSITION.LEFT}
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((item: any) => (
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
            title={`No questions yet for ${tagName}`}
            description={`While there are currently no questions for ${tagName}, your contribution can make a significant impact. Consider initiating a discussion or seeking answers within this tag to enrich our community's knowledge. Start by asking a question or exploring other engaging tags. Happy exploring!`}
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <Pagination pageNumber={+page} isNext={result.isNextQuestions} />
    </>
  );
};

export default TagDetailsPage;
