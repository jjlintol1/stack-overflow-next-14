import { formatDate } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Filters from "./Filters";
import { getAnswers } from "@/lib/actions/answer.action";
import { AnswerFilters } from "@/constants/filters";
import Image from "next/image";
import { VOTES_COMPONENT_TYPES } from "@/constants";

interface IAllAnswersProps {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: IAllAnswersProps) => {
  const result = await getAnswers({ questionId });

  const answers = result.answers;
  return (
    <div className="mt-11">
      <div className="flex w-full items-center justify-between">
        <p className="paragraph-medium primary-text-gradient">
          {totalAnswers} Answers
        </p>
        <Filters filters={AnswerFilters} />
      </div>
      <div className="mb-8">
        {answers.map((item: any) => (
          <article
            key={item._id}
            className="light-border w-full border-b py-10"
          >
            <div className="mb-8 flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${item.author.clerkId}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <Image
                  src={item.author.picture}
                  width={18}
                  height={18}
                  alt="profile"
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="body-semibold text-dark300_light700">
                    {item.author.name}
                  </p>
                  <p className="small-regular text-light400_light500 line-clamp-1 flex items-center max-sm:mt-0.5">
                    <span className="hidden sm:block">&nbsp;•&nbsp;</span>
                    answered {formatDate(item.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex items-center justify-end gap-5 max-sm:w-full">
                <Votes
                  type={VOTES_COMPONENT_TYPES.ANSWER}
                  itemId={JSON.stringify(item._id)}
                  userId={JSON.stringify(userId)}
                  upvotes={item.upvotes.length}
                  hasUpvoted={item.upvotes.includes(userId)}
                  downvotes={item.downvotes.length}
                  hasDownvoted={item.downvotes.includes(userId)}
                />
              </div>
            </div>
            <ParseHTML data={item.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
