import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface IRenderTagProps {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
  clickable?: boolean;
}

const RenderTag = ({
  _id,
  name,
  totalQuestions,
  showCount
}: IRenderTagProps) => {
    return (
      <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
        <Badge className="subtle-medium background-light800_dark300 text-light400_light500 line-clamp-1 rounded-md border-none px-4 py-2 uppercase">
          {name}
        </Badge>
        {showCount && (
          <p className="small-medium text-dark500_light700">{totalQuestions}</p>
        )}
      </Link>
    );
};

export default RenderTag;
