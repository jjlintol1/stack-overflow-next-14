import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";

const dummyQuestions = [
  {
    _id: "1",
    title:
      "Would it be appropriate to point out an error in another paper during a referee report?",
  },
  {
    _id: "2",
    title: "How can an airconditioning machine exist?",
  },
  {
    _id: "3",
    title: "Interrogated every time crossing UK Border as citizen",
  },
  {
    _id: "4",
    title: "Low digit addition generator",
  },
  {
    _id: "5",
    title: "What is an example of 3 numbers that do not make up a vector?",
  },
];

const dummyTags = [
  {
    _id: "1",
    name: "JavaScript",
    totalQuestions: 10000,
  },
  {
    _id: "2",
    name: "Next.js",
    totalQuestions: 10000,
  },
  {
    _id: "3",
    name: "Node.js",
    totalQuestions: 10000,
  },
  {
    _id: "4",
    name: "React.js",
    totalQuestions: 10000,
  },
  {
    _id: "5",
    name: "Python",
    totalQuestions: 10000,
  },
];

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

const RightSidebar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark300_light900">
          Top Questions
        </h3>
        <div className="mt-7 flex flex-col gap-7">
          {dummyQuestions.slice(0, 5).map((item) => (
            <QuestionLink key={item._id} _id={item._id} title={item.title} />
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark300_light900 mb-[26px]">
          Popular Tags
        </h3>
        <div className="mt-7 flex flex-col gap-4">
          {dummyTags.map((item) => (
            <RenderTag
              key={item._id}
              _id={item._id}
              name={item.name}
              totalQuestions={item.totalQuestions}
              showCount={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
