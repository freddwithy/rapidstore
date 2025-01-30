import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/category-form";

const OrderPage = async ({
  params,
}: {
  params: {
    storeId: string;
    categoryId: string;
  };
}) => {
  const { storeId, categoryId } = params;

  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {category?.id ? "Editar categoría" : "Crear categoría"}
        </CardTitle>
        <CardDescription>
          {category?.id
            ? "Aqui podrás editar los datos de la catería."
            : "Aqui podrás crear una nueva categoría."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CategoryForm initialData={category} storeId={storeId} />
      </CardContent>
    </Card>
  );
};

export default OrderPage;
