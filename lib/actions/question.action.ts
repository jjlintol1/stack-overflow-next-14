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
  IRecommendedParams,
  IToggleSaveQuestionParams,
} from "@/types/shared";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Interaction, { INTERACTION_TYPES } from "@/database/interaction.model";
import { FilterQuery } from "mongoose";
import { HOME_PAGE_FILTER_VALUES } from "@/constants/filters";

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

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    // Calculate the number of posts to skip based on page and pageSize
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          content: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    const sort: any = {};

    switch (filter) {
      case HOME_PAGE_FILTER_VALUES.NEWEST:
        sort.createdAt = -1;
        break;
      case HOME_PAGE_FILTER_VALUES.FREQUENT:
        sort.views = -1;
        break;
      case HOME_PAGE_FILTER_VALUES.UNANSWERED:
        query.answers = {
          $exists: true,
          $eq: [],
        };
        break;
      default:
        break;
    }

    const totalQuestions = await Question.countDocuments(query);

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sort);

    const isNextQuestions = totalQuestions > skipAmount + questions.length;

    return {
      questions,
      isNextQuestions,
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
    await Interaction.create({
      user: author,
      action: INTERACTION_TYPES.ASK_QUESTION,
      question: question._id,
      tag: tagDocuments,
    });
    // Increment author's reputation by 5 points for asking a question
    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 5 },
    });

    // revalidatePath allows you to purge cached data for a specific path
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteQuestion(params: IQuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;
    let question;
    let userIncrementAmount;
    let authorIncrementAmount;
    if (hasUpvoted) {
      // Remove upvote if previously upvoted
      question = await Question.findByIdAndUpdate(questionId, {
        $pull: { upvotes: userId },
      });
      userIncrementAmount = -1;
      authorIncrementAmount = -10;
      await Interaction.findOneAndDelete({
        user: userId,
        question: question._id,
        action: INTERACTION_TYPES.UPVOTE_QUESTION,
      });
    } else if (hasDownvoted) {
      // Remove downvote and add upvote
      question = await Question.findByIdAndUpdate(questionId, {
        $push: { upvotes: userId },
        $pull: { downvotes: userId },
      });
      userIncrementAmount = 2;
      authorIncrementAmount = 20;
      await Interaction.findOneAndDelete({
        user: userId,
        question: question._id,
        action: INTERACTION_TYPES.DOWNVOTE_QUESTION,
      });
      await Interaction.create({
        user: userId,
        question: question._id,
        action: INTERACTION_TYPES.UPVOTE_QUESTION,
        tags: question.tags,
      });
    } else {
      // Add upvote if user has neither upvoted or downvoted
      question = await Question.findByIdAndUpdate(questionId, {
        $push: { upvotes: userId },
      });
      userIncrementAmount = 1;
      authorIncrementAmount = 10;
      await Interaction.create({
        user: userId,
        question: question._id,
        action: INTERACTION_TYPES.UPVOTE_QUESTION,
        tags: question.tags,
      });
    }

    if (userId !== question.author) {
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: userIncrementAmount },
      });

      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: authorIncrementAmount },
      });
    }

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

    let question;
    let userIncrementAmount;
    let authorIncrementAmount;

    if (hasDownvoted) {
      // Remove downvote if previously downvoted
      question = await Question.findByIdAndUpdate(questionId, {
        $pull: { downvotes: userId },
      });
      userIncrementAmount = 1;
      authorIncrementAmount = 10;
      await Interaction.findOneAndDelete({
        user: userId,
        question: question._id,
        action: INTERACTION_TYPES.DOWNVOTE_QUESTION,
      });
    } else if (hasUpvoted) {
      // Remove upvote and replace with a downvote
      question = await Question.findByIdAndUpdate(questionId, {
        $push: { downvotes: userId },
        $pull: { upvotes: userId },
      });
      userIncrementAmount = -2;
      authorIncrementAmount = -20;
      await Interaction.findOneAndDelete({
        user: userId,
        question: question._id,
        action: INTERACTION_TYPES.UPVOTE_QUESTION,
      });
      await Interaction.create({
        user: userId,
        question: question._id,
        action: INTERACTION_TYPES.DOWNVOTE_QUESTION,
        tags: question.tags,
      });
    } else {
      // Add downvote if user has neither upvoted or downvoted
      question = await Question.findByIdAndUpdate(questionId, {
        $push: { downvotes: userId },
      });
      userIncrementAmount = -1;
      authorIncrementAmount = -10;
      await Interaction.create({
        user: userId,
        question: question._id,
        action: INTERACTION_TYPES.DOWNVOTE_QUESTION,
        tags: question.tags,
      });
    }

    if (userId !== question.author) {
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: userIncrementAmount },
      });

      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: authorIncrementAmount },
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

    const question = await Question.findOneAndDelete({
      _id: questionId,
    });

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

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: -5 },
    });

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

export async function getRecommendedQuestions(params: IRecommendedParams) {
  console.log("Getting recommended questions")
  try {
    connectToDatabase();
    
    const { userId, page = 1, pageSize = 10, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;
    
    const interactions = await Interaction.find({
      user: userId
    });
    
    const tagsArrays: string[][] = interactions.map((item) => item.tags);
    
    const allTags: string[] = ([] as string[]).concat(...tagsArrays);
    
    // @ts-ignore
    const uniqueTags: string[] = [...new Set(allTags)];
    
    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: uniqueTags } },
        { author: { $ne: userId } }
      ]
    };

    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          content: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: 'tags',
        model: Tag
      })
      .populate({
        path: "author",
        model: User
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNextQuestions = totalQuestions > skipAmount + recommendedQuestions.length;

    return {
      questions: recommendedQuestions,
      isNextQuestions
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
