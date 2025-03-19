"use client";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  return (
    <Button
      variant="outline"
      onClick={() => {
        window.history.back();
      }}
    >
      <ArrowLeft />
      Volver
    </Button>
  );
};

export default BackButton;
