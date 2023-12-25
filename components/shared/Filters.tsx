"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IFiltersProps {
  filters: {
    value: string;
    name: string;
  }[];
  containerClasses?: string;
  otherClasses?: string;
}

const Filters = ({
  filters,
  containerClasses,
  otherClasses,
}: IFiltersProps) => {
  return (
    <>
      <div className={`relative ${containerClasses}`}>
        <Select>
          <SelectTrigger
            className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
          >
            <div className="line-clamp-1 flex-1 text-left">
              <SelectValue placeholder="Select a Filter" />
            </div>
          </SelectTrigger>
          <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
            <SelectGroup>
              {filters.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default Filters;
