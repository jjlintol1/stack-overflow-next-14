import Link from "next/link";
import { Badge } from "../ui/badge";

interface ITagCardProps {
    _id: string;
    name: string;
    description: string;
    totalQuestions: number;
}

const TagCard = ({
    _id,
    name,
    description,
    totalQuestions
}: ITagCardProps) => {
  return (
    <Link href={`tags/${_id}`} className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
        <article className="background-light900_dark200 light-border flex w-full flex-col items-start justify-center rounded-2xl border px-8 py-10">
            <Badge className="background-light800_dark400 rounded-md px-5 py-[6px]">
                <p className="paragraph-semibold text-dark300_light900">{name}</p>
            </Badge>
            <div className="mt-5 w-full">
                <p className="small-regular text-dark500_light700">{description}</p>
                <p className="small-medium text-dark400_light500 mt-3.5">
                    <span className="body-semibold primary-text-gradient mr-2.5">{totalQuestions}+</span> Questions
                </p>
            </div>
        </article>
    </Link>
  )
}

export default TagCard