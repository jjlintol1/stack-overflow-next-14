/* eslint-disable no-unused-vars */
export const AnswerFilters = [
  { name: "Highest Upvotes", value: "highestUpvotes" },
  { name: "Lowest Upvotes", value: "lowestUpvotes" },
  { name: "Most Recent", value: "recent" },
  { name: "Oldest", value: "old" },
];

export const UserFilters = [
  { name: "New Users", value: "new_users" },
  { name: "Old Users", value: "old_users" },
  { name: "Top Contributors", value: "top_contributors" },
];

export const QuestionFilters = [
  { name: "Most Recent", value: "most_recent" },
  { name: "Oldest", value: "oldest" },
  { name: "Most Voted", value: "most_voted" },
  { name: "Most Viewed", value: "most_viewed" },
  { name: "Most Answered", value: "most_answered" },
];

export const TagFilters = [
  { name: "Popular", value: "popular" },
  { name: "Recent", value: "recent" },
  { name: "Name", value: "name" },
  { name: "Old", value: "old" },
];

export const HomePageFilters = [
  { name: "Newest", value: "newest" },
  { name: "Recommended", value: "recommended" },
  { name: "Frequent", value: "frequent" },
  { name: "Unanswered", value: "unanswered" },
];

export const GlobalSearchFilters = [
  { name: "Question", value: "question" },
  { name: "Answer", value: "answer" },
  { name: "User", value: "user" },
  { name: "Tag", value: "tag" },
];

export enum ANSWER_FILTER_VALUES {
  HIGHEST_UPVOTES = "highestUpvotes",
  LOWEST_UPVOTES = "lowestUpvotes",
  MOST_RECENT = "recent",
  OLDEST = "old",
}

export enum USER_FILTER_VALUES {
  NEW_USERS = "new_users",
  OLD_USERS = "old_users",
  TOP_CONTRIBUTORS = "top_contributors",
}

export enum QUESTION_FILTER_VALUES {
  MOST_RECENT = "most_recent",
  OLDEST = "oldest",
  MOST_VOTED = "most_voted",
  MOST_VIEWED = "most_viewed",
  MOST_ANSWERED = "most_answered",
}

export enum TAG_FILTER_VALUES {
  POPULAR = "popular",
  RECENT = "recent",
  NAME = "name",
  OLD = "old",
}

export enum HOME_PAGE_FILTER_VALUES {
  NEWEST = "newest",
  RECOMMENDED = "recommended",
  FREQUENT = "frequent",
  UNANSWERED = "unanswered",
}

export enum GLOBAL_SEARCH_FILTER_VALUES {
  QUESTION = "question",
  ANSWER = "answer",
  USER = "user",
  TAG = "tag",
}

