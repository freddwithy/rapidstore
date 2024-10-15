import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const Page = () => {
  return (
    <div className="w-full h-dvh p-4 space-y-4">
      <div className="w-full space-y-1.5 mt-5">
        <h2 className="text-2xl font-semibold tracking-tight leading-none">
          Crear tienda
        </h2>
        <p className="text-muted-foreground">
          Detalla la información de tu tienda.
        </p>
      </div>
      <Card className="pt-4">
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default Page;
