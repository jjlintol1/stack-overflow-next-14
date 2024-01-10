import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import queryString from "query-string"
import { BADGE_CRITERIA } from "@/constants";
import { IBadgeCounts } from "@/types";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(date: Date): string {
  const currentDate = new Date();
  const timestamp = date.getTime();
  const timeDifference = currentDate.getTime() - timestamp;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const years: number = Math.floor(days / 365);

  if (years > 0) {
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  } else if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (seconds > 0) {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  } else {
    return 'Just Now';
  }
}

export function formatLargeNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return (num / 1000000).toFixed(1) + 'm';
  }
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedDate;
}

export function formatMonthYear(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedDate;
}

interface IFormUrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export function formUrlQuery({ params, key, value }: IFormUrlQueryParams) {
  const parsed = queryString.parse(params);
  parsed[key] = value;
  return queryString.stringifyUrl({
    url: window.location.pathname,
    query: parsed
  },
  {
    skipNull: true,
    skipEmptyString: true
  }
  );
}

interface IRemoveKeysFromQueryParams {
  params: string;
  keysToRemove: string[];
}

export function removeKeysFromQuery({ params, keysToRemove }: IRemoveKeysFromQueryParams) {
  const parsed = queryString.parse(params);
  for (const key of keysToRemove) {
    delete parsed[key];
  };
  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query: parsed
    },
    {
      skipEmptyString: true,
      skipNull: true
    }
  );
}

interface IBadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA,
    count: number
  }[];
}

export function assignBadges(params: IBadgeParam) {
  const badgeCounts: IBadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0
  }

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof IBadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
}


