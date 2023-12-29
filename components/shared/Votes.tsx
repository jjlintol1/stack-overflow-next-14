"use client";

import { VOTES_COMPONENT_TYPES, VOTE_ACTION_TYPES } from "@/constants";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import {
  downvoteQuestion,
  toggleSaveQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { formatLargeNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface IVotesProps {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
}: IVotesProps) => {
  const pathname = usePathname();

  const handleVote = async (action: string) => {
    if (!userId) {
      return;
    }
    if (action === VOTE_ACTION_TYPES.UPVOTE) {
      if (type === VOTES_COMPONENT_TYPES.QUESTION) {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      } else if (type === VOTES_COMPONENT_TYPES.ANSWER) {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      }
      // TODO: show toast
    } else if (action === VOTE_ACTION_TYPES.DOWNVOTE) {
      if (type === VOTES_COMPONENT_TYPES.QUESTION) {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      } else if (type === VOTES_COMPONENT_TYPES.ANSWER) {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      }
      // TODO: show toast
    }
    
  };

  return (
    <div className="flex items-center justify-end gap-5 max-sm:w-full">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={`/assets/icons/${hasUpvoted ? "upvoted" : "upvote"}.svg`}
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote(VOTE_ACTION_TYPES.UPVOTE)}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatLargeNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Image
            src={`/assets/icons/${hasDownvoted ? "downvoted" : "downvote"}.svg`}
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote(VOTE_ACTION_TYPES.DOWNVOTE)}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{formatLargeNumber(downvotes)}</p>
          </div>
        </div>
      </div>
      {type === VOTES_COMPONENT_TYPES.QUESTION && hasSaved !== undefined && (
        <Image
          src={`/assets/icons/${hasSaved ? "star-filled" : "star-red"}.svg`}
          alt="save"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => toggleSaveQuestion({
            userId: JSON.parse(userId),
            questionId: JSON.parse(itemId),
            hasSaved,
            path: pathname
          })}
        />
      )}
    </div>
  );
};

export default Votes;
