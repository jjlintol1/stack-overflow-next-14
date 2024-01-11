"use client"

import Image from "next/image";
import React, { useEffect, useState } from "react";
import GlobalFilters from "./GlobalFilters";
import { useSearchParams } from "next/navigation";
import { globalSearch } from "@/lib/actions/general.action";

import { ReloadIcon } from "@radix-ui/react-icons";
import { GLOBAL_SEARCH_FILTER_VALUES } from "@/constants/filters";
import Link from "next/link";

interface ISearchResultProps {
  id: string;
  type: string;
  title: string;
}

const SearchResult = ({ id, type, title }: ISearchResultProps) => {
  const renderLink = (id: string, type: string) => {
    switch (type) {
      case GLOBAL_SEARCH_FILTER_VALUES.QUESTION:
      case GLOBAL_SEARCH_FILTER_VALUES.ANSWER:
        return `/question/${id}`;
      case GLOBAL_SEARCH_FILTER_VALUES.TAG:
        return `/tags/${id}`;
      case GLOBAL_SEARCH_FILTER_VALUES.USER:
        return `/profile/${id}`;
      default:
        return "";
    }
  }

  return (
    <Link href={renderLink(id, type)} className="flex cursor-pointer items-start gap-3.5 bg-inherit px-6 py-3 hover:bg-light-700/50 hover:dark:bg-dark-500/50">
      <Image
        src="/assets/icons/tag.svg"
        width={20}
        height={20}
        alt="search result"
        className="invert-colors"
      />
      <div className="flex flex-col gap-1">
        <p className="paragraph-semibold text-dark200_light900 line-clamp-1">
          {title}
        </p>
        <p className="body-semibold text-light400_light500 capitalize">{type}</p>
      </div>
    </Link>
  );
};



const GlobalResult = () => {
    const [result, setResult] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const searchParams = useSearchParams();

    const globalQuery = searchParams.get("global");
    const type = searchParams.get("type");

    useEffect(() => {
      const fetchResult = async () => {
        setResult([]);
        setIsLoading(true);
        try {
            const searchResults = await globalSearch({
                query: globalQuery,
                type
            });
            setResult(searchResults?.results);   
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
      }
      fetchResult();
    }, [globalQuery, type]);
    

  return (
    <div className="background-light800_dark400 absolute top-full z-10 mt-3 w-full rounded-xl">
      <div className="light-border-2 flex items-center gap-5 border-b p-6">
        <h4 className="base-semibold text-dark400_light800">Type:</h4>
        <GlobalFilters />
      </div>
      <div className="py-6">
        <h4 className="base-bold text-dark400_light800 px-6">Top Match</h4>
        <div className="mt-8 flex w-full flex-col gap-3">
          {result.length ? result.map((item) => (
            <SearchResult key={item.id} id={item.id} type={item.type} title={item.title} />
          )) : isLoading ? (
            <div className="flex-center flex-col">
                <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
                <p className="body-regular text-dark200_light800">Searching the entire database...</p>
            </div>
          ) : (
            <div className="flex-center flex-col">
                <p className="text-5xl">🫣</p>
                <p className="body-regular text-dark200_light800">Oops, no results found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalResult;
