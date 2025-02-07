import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { ColorClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;
  const user = await currentUser();

  const userDb = await prismadb.user.findFirst({
    where: {
      clerk_id: user?.id,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
  });

  const formattedData = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
  }));

  if (!userDb) {
    return <p>No estas autorizado</p>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Colores</CardTitle>
        <CardDescription>
          Aqui podras ver y editar los colores para productos de tu tienda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {colors.length > 2 && userDb.user_type === "FREE" && (
          <Alert>
            <AlertTriangle className="size-4" />
            <AlertTitle>Ya no puedes agregar más colores.</AlertTitle>
            <AlertDescription>
              Si deseas agregar más colores y disfrutrar de otros beneficios de
              Giddi, le recomendamos revisar nuestros planes premium.
            </AlertDescription>
          </Alert>
        )}
        <ColorClient data={formattedData} userType={userDb.user_type} />
      </CardContent>
    </Card>
  );
};

export default ColorsPage;
