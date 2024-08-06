import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopPopularTags } from "@/lib/actions/tag.actions";

const QuestionLink = ({ _id, title }: { _id: string; title: string }) => {
  return (
    <Link href={`/questions/${_id}`} className="flex-between gap-7">
      <p className="body-medium text-dark500_light700">{title}</p>
      <Image
        src="/assets/icons/chevron-right.svg"
        width={20}
        height={20}
        alt="arrow"
        className="invert-colors"
      />
    </Link>
  );
};

const RightSidebar = async () => {
  const hotQuestions = await getHotQuestions();

  const popularTags = await getTopPopularTags();

  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark300_light900">
          Top Questions
        </h3>
        <div className="mt-7 flex flex-col gap-7">
          {hotQuestions.map((item) => (
            <QuestionLink key={item._id} _id={item._id} title={item.title} />
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark300_light900 mb-[26px]">
          Popular Tags
        </h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((item) => (
            <RenderTag
              key={item._id}
              _id={item._id}
              name={item.name}
              totalQuestions={item.numberOfQuestions}
              showCount={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
