"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  ICreateQuestionParams,
  IGetQuestionByIdParams,
  IGetQuestionsParams,
  IQuestionVoteParams,
  IToggleSaveQuestionParams,
} from "@/types/shared";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";

export async function getQuestionById(params: IGetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .populate({ path: "answers", model: Answer });
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestions(params: IGetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find()
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });
    return {
      questions,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: ICreateQuestionParams) {
  try {
    // connect to DB
    connectToDatabase();
    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });
    const tagDocuments = [];

    // create tag or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(`^${tag}^$`, "i"),
          },
        },
        {
          $setOnInsert: {
            name: tag,
          },
          $push: {
            questions: question._id,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
      tagDocuments.push(existingTag._id);
    }

    // add tags to question
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // add question to user object
    await User.findByIdAndUpdate(question.author, {
      $push: { posts: question._id },
    });

    // Create an interaction record for the user's ask_question action

    // Increment author's reputation by 5 points for asking a question

    // revalidatePath allows you to purge cached data for a specific path
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function upvoteQuestion(params: IQuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;
    if (hasUpvoted) {
      // Remove upvote if previously upvoted
      await Question.findByIdAndUpdate(questionId, {
        $pull: { upvotes: userId },
      });
    } else if (hasDownvoted) {
      // Remove downvote and add upvote
      await Question.findByIdAndUpdate(questionId, {
        $push: { upvotes: userId },
        $pull: { downvotes: userId },
      });
    } else {
      // Add upvote if user has neither upvoted or downvoted
      await Question.findByIdAndUpdate(questionId, {
        $push: { upvotes: userId },
      });
    }

    // TODO: Increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: IQuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;
    if (hasDownvoted) {
      // Remove downvote if previously downvoted
      await Question.findByIdAndUpdate(questionId, {
        $pull: { downvotes: userId },
      });
    } else if (hasUpvoted) {
      // Remove upvote and replace with a downvote
      await Question.findByIdAndUpdate(questionId, {
        $push: { downvotes: userId },
        $pull: { upvotes: userId },
      });
    } else {
      // Add downvote if user has neither upvoted or downvoted
      await Question.findByIdAndUpdate(questionId, {
        $push: { downvotes: userId },
      });
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: IToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { userId, questionId, hasSaved, path } = params;
    if (hasSaved) {
      await User.findByIdAndUpdate(userId, {
        $pull: { saved: questionId },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { saved: questionId },
      });
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
