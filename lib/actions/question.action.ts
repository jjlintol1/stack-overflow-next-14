"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  ICreateQuestionParams,
  IDeleteQuestionParams,
  IEditQuestionParams,
  IGetQuestionByIdParams,
  IGetQuestionsParams,
  IQuestionVoteParams,
  IToggleSaveQuestionParams,
} from "@/types/shared";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

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

    const { searchQuery } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          content: { $regex: new RegExp(searchQuery, "i") },
        },
      ]
    }

    const questions = await Question.find(query)
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
            $regex: new RegExp(`^${tag}$`, "i"),
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

export async function editQuestion(params: IEditQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, title, content, tags, path } = params;

    const question = await Question.findByIdAndUpdate(questionId, {
      title,
      content,
    });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOne({
        name: {
          $regex: new RegExp(`^${tag}$`, "i"),
        },
      });

      if (!existingTag) {
        const newTag = await Tag.create({
          name: tag,
          questions: [question._id],
          description: "",
        });
        tagDocuments.push(newTag._id);
        continue;
      } else if (existingTag && !existingTag.questions.includes(question._id)) {
        existingTag.questions.push(question._id);
        await existingTag.save();
        tagDocuments.push(existingTag._id);
        continue;
      }
      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      tags: tagDocuments,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: IDeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.findByIdAndDelete(questionId);

    await Answer.deleteMany({
      question: questionId,
    });

    await Interaction.deleteMany({
      question: questionId,
    });

    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    const questions = await Question.find()
      .sort({ views: -1, upvotes: -1 }) // descending order
      .limit(5);

    return questions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
