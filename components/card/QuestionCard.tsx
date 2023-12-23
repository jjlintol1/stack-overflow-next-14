import Image from "next/image";
import RenderTag from "../shared/RenderTag";
import { timeAgo } from "@/lib/utils";

import Link from "next/link";
import Metric from "../shared/Metric";
import { Schema } from "mongoose";

interface IQuestionProps {
  _id: Schema.Types.ObjectId;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
    clerkId: string;
  };
  upvotes: string[];
  views: number;
  answers: Array<object>;
  createdAt: Date;
  clerkId?: string | null;
}

const QuestionCard = ({ _id, title, tags, author, upvotes, views, answers, createdAt, clerkId }: IQuestionProps) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <p className="small-regular sm:hidden">{timeAgo(createdAt)}</p>
      <Link href={`/question/${_id}`}>
        <h3 className="base-semibold sm:h3-semibold text-dark200_light900 line-clamp-1 flex-1">
          {title}
        </h3>
      </Link>
      <div className="mt-[14px] flex flex-wrap gap-2">
        {tags.map((item) => (
          <RenderTag key={item._id} _id={item._id} name={item.name} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-[9px]">
        <Link
          href={`profile/${author._id}`}
          className="flex items-center gap-[9px]"
        >
          <Image
            src="/assets/icons/account.svg"
            alt="author"
            width={20}
            height={20}
            className="invert-colors rounded-full"
          />
          <p className="body-regular text-dark400_light800 line-clamp-1">
            {author.name}
            <span className="small-regular max-sm:hidden">
              {" "}
              • asked {timeAgo(createdAt)}
            </span>
          </p>
        </Link>
        <div className="flex flex-wrap items-center gap-[9px]">
          <Metric
            imgUrl="/assets/icons/like.svg"
            metric={upvotes.length}
            metricTitle="votes"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            metric={answers.length}
            metricTitle="answers"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            metric={views}
            metricTitle="views"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;