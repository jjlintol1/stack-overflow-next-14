import AnswerForm from "@/components/forms/AnswerForm";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { VOTES_COMPONENT_TYPES } from "@/constants";

import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { timeAgo } from "@/lib/utils";
import { IURLProps } from "@/types";
import { auth } from "@clerk/nextjs";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevFlow - Question Details | In-Depth Insights",
  description: "Explore comprehensive details of a specific question on DevFlow. Gain in-depth insights, find solutions, and participate in meaningful discussions.",
  icons: { icon: "/assets/images/site-logo.svg" },
};

const QuestionDetailsPage = async ({ params, searchParams }: IURLProps) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const questionId = params.id;

  const question = await getQuestionById({ questionId });

  const mongoUser = await getUserById({ userId });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center gap-1"
          >
            <Image
              src={question.author.picture}
              width={22}
              height={22}
              alt="user profile picture"
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex items-center justify-end gap-5 max-sm:w-full">
            <Votes
              type={VOTES_COMPONENT_TYPES.QUESTION}
              itemId={JSON.stringify(question._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={question.upvotes.length}
              hasUpvoted={question.upvotes.includes(mongoUser._id)}
              downvotes={question.downvotes.length}
              hasDownvoted={question.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.saved.includes(question._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap items-center gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          metricTitle={`asked ${timeAgo(question.createdAt)}`}
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          metric={question.answers.length}
          metricTitle="Answers"
        />
        <Metric
          imgUrl="/assets/icons/clock.svg"
          metric={question.views}
          metricTitle="Views"
        />
      </div>
      <ParseHTML data={question.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((item: { _id: string; name: string }) => (
          <RenderTag key={item._id} _id={item._id} name={item.name} />
        ))}
      </div>
      <AllAnswers
        questionId={question._id}
        userId={mongoUser._id}
        totalAnswers={question.answers.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />
      <AnswerForm
        mongoUserId={JSON.stringify(mongoUser._id)}
        questionId={JSON.stringify(question._id)}
      />
    </>
  );
};

export default QuestionDetailsPage;
