import QuestionCard from "@/components/card/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { ICON_POSITION } from "@/constants";
import { getQuestionsByTagId } from "@/lib/actions/tag.actions";
import { IURLProps } from "@/types";
import React from "react";



const TagDetailsPage = async ({
  params,
  searchParams,
}: IURLProps) => {
  const tagId = params.id;

  const result = await getQuestionsByTagId({
    tagId,
    searchQuery: searchParams?.q,
  });

  const { tagName, questions } = result;
 
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{tagName}</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={`/collections/${tagId}`}
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
    </>
  );
};

export default TagDetailsPage;