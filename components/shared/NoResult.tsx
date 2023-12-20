import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

interface INoResultProps {
    title: string;
    description: string;
    link: string;
    linkTitle: string;
}

const NoResult = ({
    title,
    description,
    link,
    linkTitle
}: INoResultProps) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        alt="no results"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="no results"
        width={270}
        height={200}
        className="hidden object-contain dark:block"
      />
      <div className="mt-[30px] flex flex-col items-center gap-[14px]">
        <h2 className="h2-bold text-dark200_light900">{title}</h2>
        <p className="body-regular text-dark500_light500 max-w-md text-center">
          {description}
        </p>
        <Link href={link} className="mt-5 flex justify-center max-sm:w-full">
          <Button className="paragraph-medium min-h-[46px] bg-primary-500 px-4 py-3 !text-light-900">
            {linkTitle}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NoResult;
