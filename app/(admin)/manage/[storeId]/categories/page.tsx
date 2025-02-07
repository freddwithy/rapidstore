import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { CategoryClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;
  const user = await currentUser();

  const userDb = await prismadb.user.findFirst({
    where: {
      clerk_id: user?.id,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });

  const formattedData = categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
  }));

  if (!userDb) {
    return <div>No autorizado</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorías de productos</CardTitle>
        <CardDescription>
          Aquí podrás ver y editar las categorías de los productos de tu tienda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.length > 2 && userDb.user_type === "FREE" && (
          <Alert>
            <AlertTriangle className="size-4 text-yellow-500" />
            <AlertTitle>Ya no puedes agregar más categorías.</AlertTitle>
            <AlertDescription>
              Si deseas agregar más categorías y disfrutrar de otros beneficios
              de Giddi, le recomendamos revisar nuestros planes premium.
            </AlertDescription>
          </Alert>
        )}
        <CategoryClient data={formattedData} userType={userDb?.user_type} />
      </CardContent>
    </Card>
  );
};

export default CategoriesPage;
