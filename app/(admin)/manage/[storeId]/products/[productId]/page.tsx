import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";
import { currentUser } from "@clerk/nextjs/server";

const OrderPage = async ({
  params,
}: {
  params: {
    storeId: string;
    productId: string;
  };
}) => {
  const { storeId, productId } = params;
  const user = await currentUser();

  const userDb = await prismadb.user.findUnique({
    where: {
      clerk_id: user?.id,
    },
  });
  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });

  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      variants: {
        include: {
          options: true,
        },
      },
      images: true,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {product?.id ? "Editar producto" : "Crear producto"}
        </CardTitle>
        <CardDescription>
          {product?.id
            ? "Aqui podrás editar los datos del producto."
            : "Aqui podrás crear un nuevo producto."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm
          categories={categories}
          initialData={product}
          storeId={storeId}
          userType={userDb?.user_type}
        />
      </CardContent>
    </Card>
  );
};

export default OrderPage;
