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

  const existingProducts = await prismadb.product.findMany({
    where: {
      storeId,
    },
  });

  if (existingProducts.length >= 10 && userDb?.user_type === "FREE") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ya no puedes agregar más productos. 😔</CardTitle>
          <CardDescription>
            Si deseas agregar más productos y disfrutar de otros beneficios de
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
