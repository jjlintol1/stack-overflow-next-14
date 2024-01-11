import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9 flex w-full flex-col gap-10">
        {[1, 2, 3, 4, 5].map((item) => {
          const classNames = `${item === 5 ? "h-20" : "h-10"} w-full`;
          return <Skeleton key={item} className={classNames} />;
        })}
        <div className="mt-7 flex w-full justify-end">
          <Skeleton className="h-12 w-[173px]" />
        </div>
      </div>
    </>
  );
};

export default Loading;
