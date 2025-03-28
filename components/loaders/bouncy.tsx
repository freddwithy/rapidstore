"use client";
import React, { useEffect } from "react";
import { bouncy } from "ldrs";

const BouncyLoader = () => {
  useEffect(() => {
    // Register the bouncy component only on the client-side
    bouncy.register();
  }, []);

  return <l-bouncy size="60" speed="1" color="hsl(var(--primary))"></l-bouncy>;
};

export default BouncyLoader;
