"use client";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button variant="outline" onClick={() => router.back()}>
      <ArrowLeft />
      Volver
    </Button>
  );
};

export default BackButton;
