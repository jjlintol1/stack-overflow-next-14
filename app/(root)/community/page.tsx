import UserCard from "@/components/card/UserCard";
import Filters from "@/components/shared/Filters";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { ICON_POSITION } from "@/constants";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { ISearchParamsProps } from "@/types";
import Link from "next/link";

const CommunityPage = async ({ searchParams }: ISearchParamsProps) => {
  const result = await getAllUsers({
    searchQuery: searchParams?.q,
    filter: searchParams?.filter
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/community"
          iconPosition={ICON_POSITION.LEFT}
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          otherClasses="flex-1"
        />
        <Filters
          filters={UserFilters}
          otherClasses="min-h-[56px] w-full sm:w-[170px]"
        />
      </div>
      <section className="mt-12 flex w-full flex-wrap gap-4">
        {result.users.length > 0 ? result?.users.map((item) => (
          <UserCard
            key={item._id}
            clerkId={item.clerkId}
            _id={item._id}
            picture={item.picture}
            name={item.name}
            username={item.username}
          />
        )) : (
            <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
                <p>No users yet</p>
                <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
                    Join to be the first!
                </Link>
            </div>
        )}
      </section>
    </>
  );
};

export default CommunityPage;
