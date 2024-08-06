"use client";

import { HomePageFilters } from "@/constants/filters";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const HomeFilters = () => {
  const searchParams = useSearchParams();

  const filter = searchParams.get("filter");

  const [active, setActive] = useState<string>(filter || "");

  const router = useRouter();

  const handleChange = (value: string) => {
    if (value === active) {
      setActive("");
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"]
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(value);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value
      });
      router.push(newUrl, { scroll: false });
    }
  }

  useEffect(() => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value: active
    });
    router.push(newUrl, { scroll: false })
  }, [active, searchParams, router]);
  
  return (
    <div className="mt-10 hidden w-full flex-wrap items-center gap-3 md:flex">
      {HomePageFilters.map((item) => {
        const isActive = active === item.value;

        return (
          <Button
            key={item.value}
            className={`body-medium rounded-lg ${
              isActive
                ? "bg-primary-100 text-primary-500"
                : "background-light800_dark300 text-light-500"
            } px-6 py-3 ${isActive && "dark:bg-dark-400"}`}
            onClick={() => handleChange(item.value)}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilters;
