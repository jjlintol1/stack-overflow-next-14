"use client";

import { Button } from "@/components/ui/button";
import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const GlobalFilters = () => {
  const searchParams = useSearchParams();

  const type = searchParams.get("type");

  const [activeType, setActiveType] = useState(type || "");

  const router = useRouter();

  const handleChange = (value: string) => {
    if (value !== activeType) {
      setActiveType(value);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActiveType("");
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["type"],
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-3">
      {GlobalSearchFilters.map((item) => {
        const isActive = activeType === item.value;

        return (
          <Button
            key={item.value}
            className={`${
              isActive
                ? "primary-gradient text-light-800"
                : "background-light700_dark300 text-dark400_light800 hover:text-primary-500 dark:hover:text-primary-500"
            } rounded-[40px] px-5 py-2.5`}
            onClick={() => handleChange(item.value)}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default GlobalFilters;
