"use server";

import { ISearchParams } from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import { GLOBAL_SEARCH_FILTER_VALUES } from "@/constants/filters";

const SearchableTypes = ["question", "answer", "user", "tag"];

interface IModelInfo {
  model: any;
  searchFields: string[];
  type: string;
}

export async function globalSearch(params: ISearchParams) {
  try {
    connectToDatabase();

    const { query, type } = params;

    const regexQuery = {
      $regex: new RegExp(query || "", "i"),
    };

    const results = [];

    const modelsAndTypes: IModelInfo[] = [
      { model: Question, searchFields: ["title", "content"], type: "question" },
      { model: User, searchFields: ["name", "username"], type: "user" },
      { model: Answer, searchFields: ["content"], type: "answer" },
      { model: Tag, searchFields: ["name"], type: "tag" },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // No filter selected
      for (const { model, searchFields, type } of modelsAndTypes) {
        const searchQuery: FilterQuery<typeof model> = {};
        if (searchFields.length > 1) {
          searchQuery.$or = [];
          for (const field of searchFields) {
            searchQuery.$or.push({
              [field]: regexQuery,
            });
          }
        } else {
          searchQuery[searchFields[0]] = regexQuery;
        }
        const queryResults = await model.find(searchQuery).limit(2);

        results.push(
          ...queryResults.map((item: any) => ({
            title:
              type === GLOBAL_SEARCH_FILTER_VALUES.ANSWER
                ? `Answers containing ${query}`
                : item[searchFields[0]],
            type,
            id:
              type === GLOBAL_SEARCH_FILTER_VALUES.USER
                ? item.clerkId
                : type === GLOBAL_SEARCH_FILTER_VALUES.ANSWER
                  ? item.question
                  : item._id,
          }))
        );
      }
    } else {
      const modelInfo: any = modelsAndTypes.find((item) => item.type === typeLower);

      if (!modelInfo) throw new Error("Invalid search");

      const { model, searchFields, type } = modelInfo;

      const searchQuery: FilterQuery<typeof model> = {};

      if (searchFields.length > 1) {
        searchQuery.$or = [];
        for (const field of searchFields) {
          searchQuery.$or.push({
            [field]: regexQuery,
          });
        }
      } else {
        searchQuery[searchFields[0]] = regexQuery;
      }

      const queryResults = await model.find(searchQuery).limit(8);

      results.push(
        ...queryResults.map((item: any) => ({
          title:
            type === GLOBAL_SEARCH_FILTER_VALUES.ANSWER
              ? `Answers containing ${query}`
              : item[searchFields[0]],
          type,
          id:
            type === GLOBAL_SEARCH_FILTER_VALUES.USER
              ? item.clerkId
              : type === GLOBAL_SEARCH_FILTER_VALUES.ANSWER
                ? item.question
                : item._id,
        }))
      );
    }

    return {
        results: JSON.parse(JSON.stringify(results))
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
