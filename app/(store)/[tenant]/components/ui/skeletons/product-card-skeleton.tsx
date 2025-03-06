import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="border rounded-xl p-4 bg-secondary relative justify-center flex">
      <div className="flex flex-col gap-4 relative group">
        <div className="rounded-lg size-36 md:size-52 overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="space-y-1">
          <div className="space-y-1">
            <Skeleton className=" h-6 w-[96%]" />
            <Skeleton className="h-4 w-[25%]" />
          </div>
          <Skeleton className="w-[80%] h-4" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
