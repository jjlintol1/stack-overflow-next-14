import Image from "next/image";
import React from "react";
import Link from "next/link";
import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";

interface IUserCardProps {
  _id: string;
  clerkId: string;
  picture: string;
  name: string;
  username: string;
}

const UserCard = async ({
  _id,
  clerkId,
  picture,
  name,
  username,
}: IUserCardProps) => {
  const interactedTags = await getTopInteractedTags({
    userId: _id,
  });

  return (
    <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Link href={`/profile/${clerkId}`}>
          <Image
            src={picture}
            width={100}
            height={100}
            className="rounded-full"
            alt="profile"
          />
        </Link>
        <Link href={`/profile/${clerkId}`}>
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2 line-clamp-1">
              @{username}
            </p>
          </div>
        </Link>
        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTag
                  key={tag._id}
                  _id={tag._id}
                  name={
                    tag.name.length > 4
                      ? `${tag.name.substring(0, 4)}..`
                      : tag.name
                  }
                />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </div>
  );
};

export default UserCard;
