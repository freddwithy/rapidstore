import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import prismadb from "@/lib/prismadb";
import { AlertCircle } from "lucide-react";
import React from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const store = await prismadb.store.findFirst({
    where: {
      name: params.storeId,
    },
  });

  if (!store) {
    return (
      <div className="flex items-center h-dvh justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="size-4" />
          <AlertTitle>Tienda no encontrada</AlertTitle>
          <AlertDescription>
            La tienda que estás buscando no existe o fue eliminada.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return <div>{children}</div>;
}
