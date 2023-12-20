"use client";

import { HomePageFilters } from "@/constants/filters";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const HomeFilters = () => {
  const [active, setActive] = useState<string>("")
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
            onClick={() => setActive(item.value)}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilters;
