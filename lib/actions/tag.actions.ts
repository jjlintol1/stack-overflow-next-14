"use server";

import {
  IGetAllTagsParams,
  IGetQuestionsByTagIdParams,
  IGetTopInteractedTagsParams,
} from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";
import { TAG_FILTER_VALUES } from "@/constants/filters";

export async function getAllTags(params: IGetAllTagsParams) {
  try {
    connectToDatabase();

    const {
      // page = 1,
      // pageSize = 20,
      filter,
      searchQuery,
    } = params;

    const nameQuery: FilterQuery<typeof Tag> = searchQuery
      ? {
          name: { $regex: new RegExp(searchQuery, "i") },
        }
      : {};

    const sort: any = {};

    switch (filter) {
      case TAG_FILTER_VALUES.NAME:
        sort.name = 1;
        break;
      case TAG_FILTER_VALUES.POPULAR:
        sort.questions = -1;
        break;
      case TAG_FILTER_VALUES.OLD:
        sort.createdAt = 1;
        break;
      case TAG_FILTER_VALUES.RECENT:
        sort.createdAt = -1;
        break;
      default:
        break;
    }

    const tags = await Tag.find(nameQuery).sort(sort);

    return {
      tags,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopInteractedTags(
  params: IGetTopInteractedTagsParams
) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // Find interaction for the user and group by tags
    // Interaction...

    return [
      {
        _id: "1",
        name: "react",
      },
      {
        _id: "2",
        name: "next.js",
      },
      {
        _id: "3",
        name: "mongoose",
      },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: IGetQuestionsByTagIdParams) {
  try {
    connectToDatabase();
    const {
      tagId,
      // page,
      // pageSize,
      searchQuery,
    } = params;

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

    const tag = await Tag.findById(tagId).populate({
      path: "questions",
      model: Question,
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
      ],
    });

    return {
      tagName: tag.name,
      questions: tag.questions,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase();
    const tags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);
    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
