import { Skeleton } from "@/components/ui/skeleton";
import { SignedIn } from "@clerk/nextjs";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="h-[140px] w-[140px] rounded-full" />
          <div className="mt-3">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="mt-1 h-5 w-20" />
            <div className="mb-1 mt-5 flex flex-wrap items-center justify-start gap-5">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-11 w-[70%]" />
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            <Skeleton className="h-[46px] w-[175px]" />
          </SignedIn>
        </div>
      </div>
      <div className="mt-10">
        <Skeleton className="h-6 w-12" />
        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          <Skeleton className="h-[90px] p-6" />
          <Skeleton className="h-[90px] p-6" />
          <Skeleton className="h-[90px] p-6" />
          <Skeleton className="h-[90px] p-6" />
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-10">
        <Skeleton className="h-[42px] w-[230px]" />
        <div className="mt-5 flex w-full flex-col gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <Skeleton key={item} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </>
  );
};

export default Loading;
