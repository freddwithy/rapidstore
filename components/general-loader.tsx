"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the actual loader component
const BouncyLoader = dynamic(() => import("./loaders/bouncy"), {
  ssr: false,
});

const GeneralLoader = () => {
  return (
    <div className="w-full h-dvh flex items-center justify-center bg-background flex-col gap-y-4 animate-fade">
      <BouncyLoader />
    </div>
  );
};

export default GeneralLoader;
