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

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;

  const products = await prismadb.products.findMany({
    where: {
      storeId,
    },
  });

  const formattedData = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos</CardTitle>
        <CardDescription>
          Aqui podras ver y editar los productos de tu tienda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VariantClient data={formattedData} />
      </CardContent>
    </Card>
  );
};

export default ProductsPage;
