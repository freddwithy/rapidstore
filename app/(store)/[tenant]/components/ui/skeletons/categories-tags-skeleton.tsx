import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface CategoriesTagsSkeletonProps {
  count?: number;
}

const CategoriesTagsSkeleton: React.FC<CategoriesTagsSkeletonProps> = ({
  count,
}) => {
  return (
    //crear un array y mapear skeletons de acuerdo al prop
    <>
      {Array.from({ length: count || 3 }).map((_, index) => (
        <Skeleton
          key={index}
          className="flex gap-x-2 h-10 w-28 items-center px-4 py-2 rounded-full"
        />
      ))}
    </>
  );
};

export default CategoriesTagsSkeleton;
