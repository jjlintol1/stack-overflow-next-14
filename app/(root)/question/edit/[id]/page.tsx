import QuestionForm from "@/components/forms/QuestionForm";
import { QUESTION_FORM_TYPES } from "@/constants";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { IParamsProps } from "@/types";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevFlow - Edit Your Question",
  description: "Refine and optimize your questions on DevFlow. Edit for clarity, relevance, and better community engagement. Improve the quality of your queries.",
  icons: { icon: "/assets/images/site-logo.svg" },
};


const EditQuestionPage = async ({ params }: IParamsProps) => {
    const { userId } = auth();

    if (!userId) redirect('/sign-in');

    const mongoUser = await getUserById({ userId });

    const question = await getQuestionById({
        questionId: params.id
    });

    if (userId !== mongoUser.clerkId) redirect('/');

  return (
    <div>
        <h1 className="h1-bold text-dark100_light900">Edit a question</h1>
        <div className="mt-9">
            <QuestionForm mongoUserId={JSON.stringify(mongoUser._id)} type={QUESTION_FORM_TYPES.EDIT} questionDetails={JSON.stringify(question)} />
        </div>
    </div>
  )
}

export default EditQuestionPage