import Image from "next/image";
import { timeAgo } from "@/lib/utils";

import Link from "next/link";
import Metric from "../shared/Metric";
import { Schema } from "mongoose";

interface IAnswerCardProps {
  _id: Schema.Types.ObjectId;
  author: {
    _id: string;
    name: string;
    picture: string;
    clerkId: string;
  };
  upvotes: string[];
  createdAt: Date;
  question: {
    _id: string;
    title: string;
  }
  clerkId?: string | null;
}

const AnswerCard = ({ _id, author, upvotes, question, createdAt }: IAnswerCardProps) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <p className="small-regular sm:hidden">{timeAgo(createdAt)}</p>
      <Link href={`/question/${question._id}`}>
        <h3 className="base-semibold sm:h3-semibold text-dark200_light900 line-clamp-1 flex-1">
          {question.title}
        </h3>
      </Link>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-[9px]">
        <Link
          href={`profile/${author._id}`}
          className="flex items-center gap-[9px]"
        >
          <Image
            src={author.picture}
            alt="author"
            width={20}
            height={20}
            className="invert-colors rounded-full"
          />
          <p className="body-regular text-dark400_light800 line-clamp-1">
            {author.name}
            <span className="small-regular max-sm:hidden">
              {" "}
              • answered {timeAgo(createdAt)}
            </span>
          </p>
        </Link>
        <div className="flex items-center">
          <Metric
            imgUrl="/assets/icons/like.svg"
            metric={upvotes.length}
            metricTitle={upvotes.length === 1 ? "vote" : "votes"}
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
