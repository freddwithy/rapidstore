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
import { currentUser } from "@clerk/nextjs/server";

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

  const existingCategories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });

  const user = await currentUser();
  const userDb = await prismadb.user.findFirst({
    where: {
      clerk_id: user?.id,
    },
  });

  if (existingCategories.length >= 3 && userDb?.user_type === "FREE") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ya no puedes agregar más categorías.</CardTitle>
          <CardDescription>
            Si deseas agregar más categorías y disfrutar de otros beneficios de
            Tiendy, le recomendamos revisar nuestros planes premium.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
