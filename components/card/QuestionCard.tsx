import Image from "next/image";
import RenderTag from "../shared/RenderTag";
import { timeAgo } from "@/lib/utils";

import { IQuestionProps } from "@/types";
import Link from "next/link";
import Metric from "../shared/Metric";

const QuestionCard = ({ question }: { question: IQuestionProps }) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
        <p className="small-regular sm:hidden">{timeAgo(question.createdAt)}</p>
        <Link href={`/question/${question._id}`}>
            <h3 className="base-semibold sm:h3-semibold text-dark200_light900 line-clamp-1 flex-1">{question.title}</h3>
        </Link>
        <div className="mt-[14px] flex flex-wrap gap-2">
            {question.tags.map((item) => (
                <RenderTag key={item._id} _id={item._id} name={item.name} />
            ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-[9px]">
            <Link href={`profile/${question.author._id}`} className="flex items-center gap-[9px]">
                <Image src={question.author.picture} alt="author" width={20} height={20} className="rounded-full" />
                <p className="body-regular text-dark400_light800 line-clamp-1">{question.author.name}<span className="small-regular max-sm:hidden"> • asked {timeAgo(question.createdAt)}</span></p>
            </Link>
            <div className="flex flex-wrap items-center gap-[9px]">
                <Metric imgUrl="/assets/icons/like.svg" metric={question.upvotes} metricTitle="votes" />
                <Metric imgUrl="/assets/icons/message.svg" metric={question.answers.length} metricTitle="answers" />
                <Metric imgUrl="/assets/icons/eye.svg" metric={question.views} metricTitle="views" />
            </div>
        </div>
    </div>
  )
}

export default QuestionCard