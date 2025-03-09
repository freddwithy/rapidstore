"use client";
//import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { bouncy } from "ldrs";
bouncy.register();

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
    <div className="w-full h-dvh flex items-center justify-center bg-background flex-col gap-y-4 animate-fade">
      <l-bouncy size="60" speed="1" color="hsl(var(--foreground))"></l-bouncy>
    </div>
  );
};

export default Loading;
