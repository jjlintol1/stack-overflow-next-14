"use client"

import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface IPaginationProps {
  pageNumber: number;
  isNext: boolean;
}

/* eslint-disable no-unused-vars */
enum PAGINATION_ACTIONS {
    INCREASE = "increase",
    DECREASE = "decrease"
}
/* eslint-enable no-unused-vars */

const Pagination = ({ pageNumber, isNext }: IPaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

  if (!isNext && pageNumber === 1) {
    return null;
  }



  const handlePageAction = (type: string) => {
    if (type === PAGINATION_ACTIONS.INCREASE) {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "page",
            value: `${pageNumber + 1}`
        });
        router.push(newUrl);
    } else {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "page",
            value: `${pageNumber - 1}`
        });
        router.push(newUrl);
    }
  }

  return (
    <div className="flex-center mt-10 w-full gap-2">
      <Button
        className="light-border-2 btn flex-center min-h-[36px] gap-2 border"
        disabled={pageNumber === 1}
        onClick={() => handlePageAction(PAGINATION_ACTIONS.DECREASE)}
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="flex-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        className="light-border-2 btn flex-center min-h-[36px] gap-2 border"
        disabled={!isNext}
        onClick={() => handlePageAction(PAGINATION_ACTIONS.INCREASE)}
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
