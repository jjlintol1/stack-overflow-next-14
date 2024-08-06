import QuestionForm from '@/components/forms/QuestionForm'
import { QUESTION_FORM_TYPES } from '@/constants';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs'
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
  title: "DevFlow - Ask a Question | Coding Community",
  description: "Post coding questions on DevFlow and tap into the collective wisdom of our developer community. Get answers, share insights, and level up your skills.",
  icons: { icon: "/assets/images/site-logo.svg" },
};

const AskQuestionPage = async () => {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  const mongoUser = await getUserById({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a Public Question</h1>
      <div className="mt-9">
        <QuestionForm mongoUserId={JSON.stringify(mongoUser._id)} type={QUESTION_FORM_TYPES.CREATE} />
      </div>
    </>
  )
}

export default AskQuestionPage
