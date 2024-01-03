import { formatLargeNumber } from "@/lib/utils";
import Image from "next/image";

interface IStatsCardProps {
    imgUrl: string;
    badge: string;
    badgeCount: number;
}

const StatsCard = ({
    imgUrl,
    badge,
    badgeCount
}: IStatsCardProps) => {
    return (
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
            <Image src={imgUrl} height={50} width={36} alt={badge} />
            <div>
                <p className="body-semibold text-dark200_light900">{formatLargeNumber(badgeCount)}</p>
                <p className="body-medium text-dark200_light900">{badge} Badges</p>
            </div>
        </div>
    )
}

interface IStatsProps {
    totalQuestions: number;
    totalAnswers: number;
    totalGold: number;
    totalSilver: number;
    totalBronze: number;
}

const Stats = ({
    totalQuestions,
    totalAnswers,
    totalGold,
    totalSilver,
    totalBronze
}: IStatsProps) => {
  return (
    <div className="mt-10">
        <h3 className="h3-semibold text-dark200_light900">Stats</h3>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
            <div>
                <p className="body-semibold text-dark200_light900">{formatLargeNumber(totalQuestions)}</p>
                <p className="body-medium text-dark200_light900">Questions</p>
            </div>
            <div>
                <p className="body-semibold text-dark200_light900">{formatLargeNumber(totalAnswers)}</p>
                <p className="body-medium text-dark200_light900">Answers</p>
            </div>
        </div>
        <StatsCard imgUrl="/assets/icons/gold-medal.svg" badge="Gold" badgeCount={totalGold} />
        <StatsCard imgUrl="/assets/icons/silver-medal.svg" badge="Silver" badgeCount={totalSilver} />
        <StatsCard imgUrl="/assets/icons/bronze-medal.svg" badge="Bronze" badgeCount={totalBronze} />    
      </div>
    </div>
  );
};

export default Stats;
