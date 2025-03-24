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
import { currentUser } from "@clerk/nextjs/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const storeId = params.storeId;
  const user = await currentUser();

  const userDb = await prismadb.user.findFirst({
    where: {
      clerk_id: user?.id,
    },
  });

  if (!userDb) throw new Error("No se encontro el usuario");

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
        },
      },
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedData = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category.name || "Sin categoría",
    isArchived: product.isArchived,
    isFeatured: product.isFeatured,
    image: product.images[0].url || "",
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
      <CardContent className="space-y-4">
        {products.length > 9 && userDb.user_type === "FREE" && (
          <Alert>
            <AlertTriangle className="size-4" />
            <AlertTitle>Ya no puedes agregar más productos.</AlertTitle>
            <AlertDescription>
              Si deseas agregar más productos y disfrutrar de otros beneficios
              de Giddi, le recomendamos revisar nuestros planes premium.
            </AlertDescription>
          </Alert>
        )}
        <ProductClient data={formattedData} userType={userDb?.user_type} />
      </CardContent>
    </Card>
  );
};

export default ProductsPage;
