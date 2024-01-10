/* eslint-disable no-unused-vars */
import { SidebarLink } from "@/types";

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgURL: "/assets/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: "/assets/icons/suitcase.svg",
    route: "/jobs",
    label: "Find Jobs",
  },
  {
    imgURL: "/assets/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/assets/icons/question.svg",
    route: "/ask-question",
    label: "Ask a question",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};

export enum BADGE_CRITERIA_TYPES {
  QUESTION_COUNT = 'QUESTION_COUNT',
  ANSWER_COUNT = 'ANSWER_COUNT',
  QUESTION_UPVOTES = 'QUESTION_UPVOTES',
  ANSWER_UPVOTES = 'ANSWER_UPVOTES',
  TOTAL_VIEWS = 'TOTAL_VIEWS',
}

export enum ICON_POSITION {
  LEFT = "left",
  RIGHT = "right"
}

export enum VOTES_COMPONENT_TYPES {
  QUESTION = "question",
  ANSWER = "answer"
}

export enum VOTE_ACTION_TYPES {
  UPVOTE = "upvote",
  DOWNVOTE = "downvote"
}

export enum QUESTION_FORM_TYPES {
  CREATE = "create",
  EDIT = "edit"
}

export enum EDIT_DELETE_TYPES {
  QUESTION = "question",
  ANSWER = "answer"
}