"use client";
import React from "react";
import { bouncy } from "ldrs";
bouncy.register();

const GeneralLoader = () => {
  return (
    <div className="w-full h-dvh flex items-center justify-center bg-background flex-col gap-y-4 animate-fade">
      <l-bouncy size="60" speed="1" color="hsl(var(--foreground))"></l-bouncy>
    </div>
  );
};

export default GeneralLoader;
