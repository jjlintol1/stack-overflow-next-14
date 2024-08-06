import { BADGE_CRITERIA } from "@/constants";

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface IJob {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

export interface ICountry {
  name: {
    common: string;
  };
}

export interface IParamsProps {
  params: { id: string };
}

export interface ISearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface IURLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export interface IBadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;

export interface IQuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: any[];
  createdAt: Date;
}
