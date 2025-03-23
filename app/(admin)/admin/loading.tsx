import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="p-4">
      <Skeleton className="w-full h-80 space-y-2 p-4">
        <Skeleton className="w-[20%] h-8 roded" />
        <Skeleton className="w-[80%] h-6" />
        <Skeleton className=" w-[30%]" />
      </Skeleton>
    </div>
  );
};

export default Loading;
