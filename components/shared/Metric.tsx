import { formatLargeNumber } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface IMetricProps {
    imgUrl: string;
    metric: number;
    metricTitle: string;
}

const Metric = ({
    imgUrl,
    metric,
    metricTitle
}: IMetricProps) => {
  return (
    <div className="flex gap-[2px]">
      <Image src={imgUrl} width={16} height={16} alt={metricTitle} />
      <p className="small-regular text-dark400_light800 line-clamp-1">
        <span className="small-medium">{formatLargeNumber(metric)}</span> {metricTitle}
      </p>
    </div>
  );
};

export default Metric;
