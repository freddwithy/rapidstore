import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { VariantClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const VariantsPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;
  const user = await currentUser();

  const userDb = await prismadb.user.findFirst({
    where: {
      clerk_id: user?.id,
    },
  });

  const variants = await prismadb.variant.findMany({
    where: {
      storeId,
    },
  });

  const formattedData = variants.map((customer) => ({
    id: customer.id,
    name: customer.name,
    description: customer.description,
  }));

  if (!userDb) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Variantes de productos</CardTitle>
        <CardDescription>
          Aquí podrás ver y editar las variantes de los productos de tu tienda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {variants.length > 2 && userDb.user_type === "FREE" && (
          <Alert>
            <AlertTriangle className="size-4" />
            <AlertTitle>Ya no puedes agregar más variantes.</AlertTitle>
            <AlertDescription>
              Si deseas agregar más variantes y disfrutrar de otros beneficios
              de Giddi, le recomendamos revisar nuestros planes premium.
            </AlertDescription>
          </Alert>
        )}
        <VariantClient data={formattedData} userType={userDb.user_type} />
      </CardContent>
    </Card>
  );
};

export default VariantsPage;
