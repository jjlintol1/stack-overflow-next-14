import TagCard from "@/components/card/TagCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { ICON_POSITION } from "@/constants";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.actions";
import { ISearchParamsProps } from "@/types";
import React from "react";

const TagsPage = async ({ searchParams }: ISearchParamsProps) => {
  const page = searchParams?.page || "1";

  const result = await getAllTags({
    searchQuery: searchParams?.q,
    filter: searchParams?.filter,
    page: +page,
    pageSize: 20
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          iconPosition={ICON_POSITION.LEFT}
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by tag name..."
          otherClasses="flex-1"
        />
        <Filters
          filters={TagFilters}
          otherClasses="min-h-[56px] w-full sm:w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((item) => (
            <TagCard
              key={item._id}
              _id={item._id}
              name={item.name}
              description="JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS"
              totalQuestions={item.questions.length}
            />
          ))
        ) : (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags found."
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </section>
      <Pagination pageNumber={+page} isNext={result.isNextTags} />
    </>
  );
};

export default TagsPage;
