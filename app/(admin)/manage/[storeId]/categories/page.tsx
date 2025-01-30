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

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorías de productos</CardTitle>
        <CardDescription>
          Aquí podrás ver y editar las categorías de los productos de tu tienda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CategoryClient data={formattedData} />
      </CardContent>
    </Card>
  );
};

export default CategoriesPage;
