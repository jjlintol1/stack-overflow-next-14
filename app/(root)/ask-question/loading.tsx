import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a Public Question</h1>
      <div className="mt-9">
        <div className="flex w-full flex-col gap-10">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[360px] w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-[173px]" />
        </div>
      </div>
    </>
  );
};

export default Loading;
