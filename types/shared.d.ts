import { Schema } from "mongoose";

import { IUser } from "@/mongodb";

export interface ICreateAnswerParams {
  content: string;
  author: string; // User ID
  question: string; // Question ID
  path: string;
}

export interface IGetAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface IAnswerVoteParams {
  answerId: string;
  userId: string;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  path: string;
}

export interface IDeleteAnswerParams {
  answerId: string;
  path: string;
}

export interface ISearchParams {
  query?: string | null;
  type?: string | null;
}

export interface IRecommendedParams {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface IViewQuestionParams {
  questionId: string;
  userId: string | undefined;
}

export interface IJobFilterParams {
  query: string;
  page: string;
}

export interface IGetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface ICreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
  author: Schema.Types.ObjectId | IUser;
  path: string;
}

export interface IGetQuestionByIdParams {
  questionId: string;
}

export interface IQuestionVoteParams {
  questionId: string;
  userId: string;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  path: string;
}

export interface IDeleteQuestionParams {
  questionId: string;
  path: string;
}

export interface IEditQuestionParams {
  questionId: string;
  title: string;
  content: string;
  tags: string[];
  path: string;
}

export interface IGetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface IGetQuestionsByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface IGetTopInteractedTagsParams {
  userId: string;
  limit?: number;
}

export interface ICreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

export interface IGetUserByIdParams {
  userId: string;
}

export interface IGetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}

export interface IUpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

export interface IToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  hasSaved: boolean;
  path: string;
}

export interface IGetSavedQuestionsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface IGetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface IDeleteUserParams {
  clerkId: string;
}
