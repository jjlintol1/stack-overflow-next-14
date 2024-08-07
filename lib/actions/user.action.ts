"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  ICreateUserParams,
  IDeleteUserParams,
  IGetAllUsersParams,
  IGetSavedQuestionsParams,
  IGetUserByIdParams,
  IGetUserStatsParams,
  IUpdateUserParams,
} from "@/types/shared";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";
import { QUESTION_FILTER_VALUES, USER_FILTER_VALUES } from "@/constants/filters";
import { BADGE_CRITERIA_TYPES } from "@/constants";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getAllUsers(params: IGetAllUsersParams) {
  try {
    connectToDatabase();

    const {
      page = 1,
      pageSize = 20,
      filter,
      searchQuery,
    } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          username: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    const sort: any = {};

    switch (filter) {
      case USER_FILTER_VALUES.NEW_USERS:
        sort.joinedAt = -1;
        break;
      case USER_FILTER_VALUES.OLD_USERS:
        sort.joinedAt = 1;
        break;
      case USER_FILTER_VALUES.TOP_CONTRIBUTORS:
        sort.reputation = -1;
        break;
      default:
        break;
    }

    const totalUsers = await User.countDocuments(query);

    // Retrieve all users from database
    const users = await User.find(query)
      .sort(sort)
      .skip(skipAmount)
      .limit(pageSize);

    const isNextUsers = totalUsers > skipAmount + users.length;

    return {
      users,
      isNextUsers
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserById(params: IGetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(params: ICreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(params);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: IUpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;
    const newUser = await User.findOneAndUpdate(
      {
        clerkId,
      },
      updateData,
      {
        new: true,
      }
    );
    revalidatePath(path);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteUser(params: IDeleteUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOne({
      clerkId,
    });

    if (!user) throw new Error("User not found");

    // Delete user from database
    // and questions, answers, documents, etc

    // get user question ids
    // const userQuestionIds = await Question.find({
    //     author: user._id
    // }).distinct('_id');

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: IGetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const {
      clerkId,
      page = 1,
      pageSize = 20,
      filter,
      searchQuery,
    } = params;

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
      case QUESTION_FILTER_VALUES.MOST_RECENT:
        sort.createdAt = -1;
        break;
      case QUESTION_FILTER_VALUES.OLDEST:
        sort.createdAt = 1;
        break;
      case QUESTION_FILTER_VALUES.MOST_ANSWERED:
        sort.answers = -1;
        break;
      case QUESTION_FILTER_VALUES.MOST_VIEWED:
        sort.views = -1;
        break;
      case QUESTION_FILTER_VALUES.MOST_VOTED:
        sort.upvotes = -1;
        break;
      default:
        break;
    }

    const result = await User.findOne({
      clerkId,
    }).populate({
      path: "saved",
      model: Question,
      match: query
    });

    const totalQuestions = result.saved.length;

    console.log(totalQuestions);

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      model: Question,
      match: query,
      options: {
        sort,
        limit: pageSize,
        skip: skipAmount
      },
      populate: [
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isNextQuestions = totalQuestions > skipAmount + user.saved.length;

    return {
      questions: user.saved,
      isNextQuestions
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: IGetUserByIdParams) {
  try {
    connectToDatabase();
    const {
      userId,
      // page,
      // pageSize
    } = params;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User nor found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const [questionUpvotes] = await Question.aggregate([
      {
        $match: {
          author: userId
        }
      },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" }
        }
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" }
        }
      }
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      {
        $match: {
          author: userId
        }
      },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" }
        }
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" }
        }
      }
    ]);

    const [questionViews] = await Answer.aggregate([
      {
        $match: {
          author: userId
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" }
        }
      }
    ]);

    const criteria = [
      {
        type: BADGE_CRITERIA_TYPES.QUESTION_COUNT as BadgeCriteriaType,
        count: totalQuestions
      },
      {
        type: BADGE_CRITERIA_TYPES.ANSWER_COUNT as BadgeCriteriaType,
        count: totalAnswers
      },
      {
        type: BADGE_CRITERIA_TYPES.QUESTION_UPVOTES as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0
      },
      {
        type: BADGE_CRITERIA_TYPES.ANSWER_UPVOTES as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0
      },
      {
        type: BADGE_CRITERIA_TYPES.TOTAL_VIEWS as BadgeCriteriaType,
        count: questionViews?.totalViews || 0
      },
    ]

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: IGetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({
      author: userId,
    });

    const questions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1, createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

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

export async function getUserAnswers(params: IGetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({
      author: userId,
    });

    const answers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .limit(pageSize)
      .skip(skipAmount)
      .populate({ path: "question", model: Question, select: "_id title" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    const isNextAnswers = totalAnswers > skipAmount + answers.length;

    return {
      answers,
      isNextAnswers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
