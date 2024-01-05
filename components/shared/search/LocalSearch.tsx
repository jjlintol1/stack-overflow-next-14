"use client";

import { Input } from "@/components/ui/input";
import { ICON_POSITION } from "@/constants";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ILocalSearchProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: ILocalSearchProps) => {
  const searchParams = useSearchParams();

  const q = searchParams.get("q");

  const [term, setTerm] = useState(q || "");
  const [debouncedTerm, setDebouncedTerm] = useState(term);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setTerm(debouncedTerm), 500);
    return () => clearTimeout(timer);
  }, [debouncedTerm]);

  useEffect(() => {
    if (term !== "") {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "q",
        value: term
      });
      router.push(newUrl, { scroll: false });
    } else {
      if (route === pathname) {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["q"]
        });
        router.push(newUrl, { scroll: false });
      }
    }
  }, [term, route, router, searchParams, pathname]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] w-full grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === ICON_POSITION.LEFT && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={debouncedTerm}
        onChange={(e) => setDebouncedTerm(e.target.value)}
        className="paragraph-regular no-focus placeholder border-none bg-inherit shadow-none outline-none"
      />
      {iconPosition === ICON_POSITION.RIGHT && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;
