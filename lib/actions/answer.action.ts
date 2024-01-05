"use server"

import { IAnswerVoteParams, ICreateAnswerParams, IDeleteAnswerParams, IGetAnswersParams } from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";
import { ANSWER_FILTER_VALUES } from "@/constants/filters";

export async function getAnswers(params: IGetAnswersParams) {
    try {
        connectToDatabase();

        const {
            questionId,
            sortBy,
            // page,
            // pageSize
        } = params;

        const sort: any = {};

        switch (sortBy) {
          case ANSWER_FILTER_VALUES.HIGHEST_UPVOTES:
            sort.upvotes = -1;
            break;
          case ANSWER_FILTER_VALUES.LOWEST_UPVOTES:
            sort.upvotes = 1;
            break;
          case ANSWER_FILTER_VALUES.MOST_RECENT:
            sort.createdAt = -1;
            break;
          case ANSWER_FILTER_VALUES.OLDEST:
            sort.createdAt = 1;
            break;
          default:
            break;
        }

        const answers = await Answer.find({ question: questionId })
            .populate({ path: "author", model: User, select: "_id clerkId name picture" })
            .sort(sort);
        
        return {
            answers
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createAnswer(params: ICreateAnswerParams) {
    try {
        connectToDatabase();

        const { content, author, question, path } = params;

        const answer = await Answer.create({
            content,
            author,
            question
        });

        await Question.findByIdAndUpdate(answer.question, {
            $push: { answers: answer._id }
        });

        // Create interaction record for author for answering a question

        // Increment author's reputation for answering the question

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function upvoteAnswer(params: IAnswerVoteParams) {
    try {
        connectToDatabase();
        const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;
        if (hasUpvoted) { // Remove upvote if previously upvoted
          await Answer.findByIdAndUpdate(answerId, {
            $pull: { upvotes: userId },
          });
        } else if (hasDownvoted) { // Remove downvote and add upvote
          await Answer.findByIdAndUpdate(answerId, {
            $push: { upvotes: userId },
            $pull: { downvotes: userId }
          });
        } else { // Add upvote if user has neither upvoted or downvoted
          await Answer.findByIdAndUpdate(answerId, {
            $push: { upvotes: userId },
          });
        }
        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
  }
  
  export async function downvoteAnswer(params: IAnswerVoteParams) {
    try {
        connectToDatabase();
        const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;
        if (hasDownvoted) { // Remove downvote if previously downvoted
          await Answer.findByIdAndUpdate(answerId, {
            $pull: { downvotes: userId },
          });
        } else if (hasUpvoted) { // Remove upvote and replace with a downvote
          await Answer.findByIdAndUpdate(answerId, {
            $push: { downvotes: userId },
            $pull: { upvotes: userId }
          });
        } else { // Add downvote if user has neither upvoted or downvoted
          await Answer.findByIdAndUpdate(answerId, {
            $push: { downvotes: userId },
          });
        }
        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
  }

export async function deleteAnswer(params: IDeleteAnswerParams) {
  try {
    connectToDatabase();
    const { answerId, path } = params;
    const answer = await Answer.findOneAndDelete({
      _id: answerId
    });

    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answerId }
    });

    await Interaction.deleteMany({
      answer: answerId
    })
    
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}