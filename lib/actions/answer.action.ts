"use server"

import { IAnswerVoteParams, ICreateAnswerParams, IDeleteAnswerParams, IGetAnswersParams } from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import Interaction, { INTERACTION_TYPES } from "@/database/interaction.model";
import { ANSWER_FILTER_VALUES } from "@/constants/filters";

export async function getAnswers(params: IGetAnswersParams) {
    try {
        connectToDatabase();

        const {
            questionId,
            sortBy,
            page = 1,
            pageSize = 10
        } = params;

        const skipAmount = (page - 1) * pageSize;

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

        const totalAnswers = await Answer.countDocuments({ question: questionId });

        const answers = await Answer.find({ question: questionId })
            .populate({ path: "author", model: User, select: "_id clerkId name picture" })
            .skip(skipAmount)
            .limit(pageSize)
            .sort(sort);

        const isNextAnswers = totalAnswers > skipAmount + answers.length;
        
        return {
            answers,
            isNextAnswers
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

        const answeredQuestion = await Question.findByIdAndUpdate(answer.question, {
            $push: { answers: answer._id }
        });

        // Create interaction record for author for answering a question
        await Interaction.create({
          user: author,
          action: INTERACTION_TYPES.ANSWER,
          question,
          answer: answer._id,
          tags: answeredQuestion.tags
        })
        // Increment author's reputation for answering the question
        if (author !== answeredQuestion.author) {
          await User.findByIdAndUpdate(author, {
            $inc: { reputation: 10 }
          });
        }

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

        let answer;
        let userIncrementAmount;
        let authorIncrementAmount;

        if (hasUpvoted) { // Remove upvote if previously upvoted
          answer = await Answer.findByIdAndUpdate(answerId, {
            $pull: { upvotes: userId },
          });
          userIncrementAmount = -1
          authorIncrementAmount = -10;
        } else if (hasDownvoted) { // Remove downvote and add upvote
          answer = await Answer.findByIdAndUpdate(answerId, {
            $push: { upvotes: userId },
            $pull: { downvotes: userId }
          });
          userIncrementAmount = 2;
          authorIncrementAmount = 20;
        } else { // Add upvote if user has neither upvoted or downvoted
          answer = await Answer.findByIdAndUpdate(answerId, {
            $push: { upvotes: userId },
          });
          userIncrementAmount = 1;
          authorIncrementAmount = 10;
        }

        if (userId !== answer.author) {
          await User.findByIdAndUpdate(userId, {
            $inc: { reputation: userIncrementAmount }
          });
      
          await User.findByIdAndUpdate(answer.author, {
            $inc: { reputation: authorIncrementAmount }
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

        let answer;
        let userIncrementAmount;
        let authorIncrementAmount;

        if (hasDownvoted) { // Remove downvote if previously downvoted
          answer = await Answer.findByIdAndUpdate(answerId, {
            $pull: { downvotes: userId },
          });
          userIncrementAmount = 1;
          authorIncrementAmount = 10;
        } else if (hasUpvoted) { // Remove upvote and replace with a downvote
          answer = await Answer.findByIdAndUpdate(answerId, {
            $push: { downvotes: userId },
            $pull: { upvotes: userId }
          });
          userIncrementAmount = -2;
          authorIncrementAmount = -20;
        } else { // Add downvote if user has neither upvoted or downvoted
          answer = await Answer.findByIdAndUpdate(answerId, {
            $push: { downvotes: userId },
          });
          userIncrementAmount = -1;
          authorIncrementAmount = -10;
        }

        if (userId !== answer.author) {
          await User.findByIdAndUpdate(userId, {
            $inc: { reputation: userIncrementAmount }
          });
      
          await User.findByIdAndUpdate(answer.author, {
            $inc: { reputation: authorIncrementAmount }
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
    });

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: -10 }
    });
    
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}