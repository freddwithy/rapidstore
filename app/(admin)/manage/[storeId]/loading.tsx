//import { Skeleton } from "@/components/ui/skeleton";
import GeneralLoader from "@/components/general-loader";
import React from "react";

const Loading = () => {
  return (
    // <div className="w-full mx-auto max-w-[1080px] h-dvh flex flex-col">
    //   <div className="w-full py-14 px-4 md:px-8 space-y-4">
    //     <div className="flex justify-between">
    //       <div className="space-y-2">
    //         <div className="flex justify-between w-full">
    //           <Skeleton className="rounded-lg overflow-hidden border aspect-square size-32" />
    //         </div>
    //         <div className="space-y-2">
    //           <Skeleton className="w-full h-4 rounded-full" />
    //           <Skeleton className="w-1/2 h-3 rounded-full" />
    //         </div>
    //         <div className="flex gap-x-2">
    //           <Skeleton className="h-4 w-[60%]" />
    //           <Skeleton className="h-4 w-[60%]" />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <GeneralLoader />
  );
};

export default Loading;
