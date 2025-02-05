import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { ProductClient } from "./components/client";
import prismadb from "@/lib/prismadb";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;

  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      variants: {
        include: {
          color: true,
          variant: true,
          images: true,
        },
      },
    },
  });

  const formattedData = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category.name || "Sin categoría",
    isArchived: product.isArchived,
    isFeatured: product.isFeatured,
    image: product.variants[0].images[0].url || "",
    variants: product.variants.length || 0,
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
        <ProductClient data={formattedData} />
      </CardContent>
    </Card>
  );
};

export default ProductsPage;
